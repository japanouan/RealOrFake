# app/routes/analyzeWithAi.py
from fastapi import APIRouter, HTTPException, Depends
from datetime import date, datetime
import re
import json
import os

# Import Schemas ที่จำเป็นทั้งหมด
from app.schemas import ChallengeFeedback, SubmissionIn, SubmissionReasonIn
from app.routes.leaderboard import update_leaderboard
from app.services.db import get_firebase_service, get_challenge_item_by_ref, save_submission
from app.services.firebase_service import FirebaseService

router = APIRouter()

# --- ค่าคงที่สำหรับการกรอง ---
GIBBERISH_THRESHOLD = 0.6  # 60%
COPY_PASTE_THRESHOLD = 0.7 # 70%
CONTEXT_WINDOW_SIZE = 3    # จำนวนคำรอบๆ Clue Word ที่จะตรวจสอบ

# --- โหลดคลังศัพท์ (ควรทำครั้งเดียวตอนเริ่มแอป) ---
def load_vocabulary():
    """โหลดคลังคำศัพท์จากไฟล์ vocab.json"""
    vocab_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ckpt', 'vocab.json')
    try:
        with open(vocab_path, 'r', encoding='utf-8') as f:
            return set(json.load(f))
    except FileNotFoundError:
        print(f"Warning: vocab.json not found at {vocab_path}. Gibberish filter will be disabled.")
        return None

VOCABULARY = load_vocabulary()

# --- Utility Functions (สำหรับฟังก์ชันใหม่) ---
def gibberish_filter(reason: str, vocab: set) -> bool:
    if not vocab or not reason.strip(): return False
    reason_words = set(re.split(r'\W+', reason.lower())) - {''}
    if not reason_words: return True
    real_words = reason_words.intersection(vocab)
    real_word_ratio = len(real_words) / len(reason_words)
    print(f"[Gibberish Filter] Ratio: {real_word_ratio:.2f}")
    return real_word_ratio < GIBBERISH_THRESHOLD

def calculate_text_overlap(reason: str, news: str) -> float:
    if not reason or not news: return 0.0
    reason_words = set(re.split(r'\W+', reason.lower())) - {''}
    news_words = set(re.split(r'\W+', news.lower())) - {''}
    if not reason_words: return 0.0
    intersection = reason_words.intersection(news_words)
    return len(intersection) / len(reason_words)

def contextual_check(clue_word: str, reason: str, news_text: str, window_size: int) -> bool:
    reason_words = re.split(r'\W+', reason.lower())
    news_words_set = set(re.split(r'\W+', news_text.lower())) - {''}
    try:
        clue_index = reason_words.index(clue_word.lower())
    except ValueError:
        return False
    start = max(0, clue_index - window_size)
    end = min(len(reason_words), clue_index + window_size + 1)
    context_words = set(reason_words[start:clue_index] + reason_words[clue_index+1:end]) - {''}
    if not context_words: return False
    return not context_words.isdisjoint(news_words_set)

# ==========================================================
#  1. ENDPOINT เดิม (/analyzewithai)
#  - รับข้อมูลจาก Checkbox (userClues)
#  - ไม่มีการกรอง 3 ชั้น
# ==========================================================
@router.post(
    "/analyzewithai",
    response_model=ChallengeFeedback,
    tags=["challenges"],
    summary="Analyze a user's submission using checkbox clues"
)
def analyze_submission(
    submission: SubmissionIn, # <-- ใช้ Schema เดิม
    firebase_service: FirebaseService = Depends(get_firebase_service)
):
    """(Logic เดิม) รับคำตอบ, คำนวณคะแนนจาก userClues ที่เลือก"""
    print("\n--- ANALYZING SUBMISSION (CLUE-BASED LOGIC) ---")
    
    try:
        item_data = get_challenge_item_by_ref(firebase_service, submission.itemRef)
        if not item_data:
            raise HTTPException(status_code=404, detail=f"Item '{submission.itemRef}' not found.")

        model_prediction_bool = bool(item_data.get("label", 0))
        clues_from_db = item_data.get("clue_words_analysis", [])
        suggestions_from_db = item_data.get("ai_reasoning")

        is_correct = (submission.userLabel == model_prediction_bool)
        final_score = 25 if is_correct else 0
        
        updated_clues = []
        if isinstance(clues_from_db, list) and clues_from_db:
            reasoning_points_pool = 75
            score_per_clue = reasoning_points_pool / len(clues_from_db)
            lowercase_clues = [word.lower() for word in submission.userClues]
            
            for clue in clues_from_db:
                new_clue = clue.copy()
                found = new_clue.get('word', '').lower() in lowercase_clues
                new_clue['found_in_reason'] = found
                if found:
                    final_score += score_per_clue if is_correct else (score_per_clue / 3)
                updated_clues.append(new_clue)
        
        final_score = min(100, int(final_score))
        
        explanation_text = f"คุณวิเคราะห์ได้ตรงกับ AI! โมเดลเห็นว่านี่คือ '{'ข่าวจริง' if model_prediction_bool else 'ข่าวปลอม'}'" if is_correct else f"มุมมองของคุณต่างจาก AI เล็กน้อย โมเดลวิเคราะห์ว่าเป็น '{'ข่าวจริง' if model_prediction_bool else 'ข่าวปลอม'}'"
        
        formatted_suggestions = [{"text": s.get("text")} for s in (suggestions_from_db or []) if isinstance(s, dict) and "text" in s]

        final_feedback = {
            "score": final_score, "correct": is_correct, "explanation": explanation_text,
            "clue_words_analysis": updated_clues, "suggestions": formatted_suggestions,
            "ai_reasoning": suggestions_from_db
        }
        
        # (ส่วนของการบันทึกข้อมูลและอัปเดต leaderboard)
        # ... คุณสามารถคัดลอกโค้ดส่วนนี้จากฟังก์ชันที่คุณเคยมีอยู่มาใส่ตรงนี้ได้เลย ...

        return ChallengeFeedback(**final_feedback)

    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# ==========================================================
#  2. ENDPOINT ใหม่ (/analyze/reason)
#  - รับข้อมูลเป็นข้อความ (userReason)
#  - มีการกรอง 3 ชั้น
# ==========================================================
@router.post(
    "/analyze/reason",
    response_model=ChallengeFeedback,
    tags=["challenges"],
    summary="Analyze a user's submission with a text reason using a 3-stage filter"
)
def analyze_submission_with_reason(
    submission: SubmissionReasonIn, # <-- ใช้ Schema ใหม่
    firebase_service: FirebaseService = Depends(get_firebase_service)
):
    """(Logic ใหม่) รับเหตุผลที่เป็นข้อความยาว, ตรวจสอบผ่าน 3 ด่านกรอง"""
    print("\n--- ANALYZING SUBMISSION WITH REASON (3-STAGE FILTER LOGIC) ---")
    
    try:
        item_data = get_challenge_item_by_ref(firebase_service, submission.itemRef)
        news_text = item_data.get('text') if item_data else None
        user_reason = submission.userReason.lower() if submission.userReason else ""

        if not news_text:
            raise HTTPException(status_code=404, detail=f"Item '{submission.itemRef}' not found.")

        model_prediction_bool = bool(item_data.get("label", 0))
        clues_from_db = item_data.get("clue_words_analysis", [])
        suggestions_from_db = item_data.get("ai_reasoning")

        is_correct = (submission.userLabel == model_prediction_bool)
        base_score = 25 if is_correct else 0
        reasoning_score = 0
        reasoning_penalty_reason = None

        if not user_reason.strip():
            reasoning_penalty_reason = "คุณยังไม่ได้ให้เหตุผลประกอบ"
        elif gibberish_filter(user_reason, VOCABULARY):
            reasoning_penalty_reason = "เหตุผลประกอบด้วยคำที่ไม่มีความหมาย"
        elif calculate_text_overlap(user_reason, news_text) > COPY_PASTE_THRESHOLD:
            reasoning_penalty_reason = "เหตุผลมีความคล้ายคลึงกับเนื้อหาข่าวมากเกินไป"
        else:
            if isinstance(clues_from_db, list) and clues_from_db:
                reasoning_points_pool = 75
                score_per_clue = reasoning_points_pool / len(clues_from_db)
                
                for clue in clues_from_db:
                    clue_word = clue.get('word', '').lower()
                    if clue_word in user_reason:
                        clue['found_in_reason'] = True
                        if contextual_check(clue_word, user_reason, news_text, CONTEXT_WINDOW_SIZE):
                            reasoning_score += score_per_clue
                            clue['context_pass'] = True
                        else:
                            clue['context_pass'] = False
                    else:
                        clue['found_in_reason'] = False
                        clue['context_pass'] = None
                
                if not is_correct:
                    reasoning_score /= 3
        
        final_score = min(100, int(base_score + reasoning_score))
        
        explanation_text = f"คุณวิเคราะห์ได้ตรงกับ AI! โมเดลเห็นว่านี่คือ '{'ข่าวจริง' if model_prediction_bool else 'ข่าวปลอม'}'" if is_correct else f"มุมมองของคุณต่างจาก AI เล็กน้อย โมเดลวิเคราะห์ว่าเป็น '{'ข่าวจริง' if model_prediction_bool else 'ข่าวปลอม'}'"
        if reasoning_penalty_reason:
            explanation_text += f"\n\n**หมายเหตุ:** คะแนนในส่วนเหตุผลเป็น 0 เนื่องจาก {reasoning_penalty_reason}"

        formatted_suggestions = [{"text": s.get("text")} for s in (suggestions_from_db or []) if isinstance(s, dict) and "text" in s]

        final_feedback = {
            "score": final_score, "correct": is_correct, "explanation": explanation_text,
            "clue_words_analysis": clues_from_db, "suggestions": formatted_suggestions,
            "ai_reasoning": suggestions_from_db
        }
        
        # (ส่วนของการบันทึกข้อมูลและอัปเดต leaderboard)
        # ... คุณสามารถคัดลอกโค้ดส่วนนี้จากฟังก์ชันที่คุณเคยมีอยู่มาใส่ตรงนี้ได้เลย ...

        return ChallengeFeedback(**final_feedback)

    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# ====================================================
#  3. UTILITY ENDPOINTS
#  - /challenges/today และ /debug-db ถูกย้ายไปอยู่ที่ app/routes/admin.py
#    (mount ใต้ /api/v1 และมี require_admin guard) เพื่อไม่ให้ซ้ำซ้อนกัน
# ====================================================