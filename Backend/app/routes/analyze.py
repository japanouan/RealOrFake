# app/routes/analyze.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from datetime import date, datetime
import re

# === Import Dependencies & Logic ===
from app.schemas import ChallengeFeedback, SubmissionIn, AdminProcessRequest, AdminProcessResponse
from app.services.model import predict_challenge # จำเป็นสำหรับ /admin/process
from app.services.db import get_firebase_service, get_challenge_item_by_ref, save_submission, get_challenge_items_for_today, get_item_by_path
from app.services.firebase_service import FirebaseService

router = APIRouter()

# --- Utility Functions ---
def calculate_text_overlap(reason: str, news: str) -> float:
    """คำนวณสัดส่วนความเหมือนของคำใน 'reason' เทียบกับ 'news'"""
    if not reason or not news: return 0.0
    reason_words = set(re.split(r'\W+', reason.lower())) - {''}
    news_words = set(re.split(r'\W+', news.lower())) - {''}
    if not reason_words: return 0.0
    intersection = reason_words.intersection(news_words)
    return len(intersection) / len(reason_words)

# ====================================================
#  1. USER-FACING ENDPOINT: /analyze
# ====================================================
@router.post(
    "/analyze",
    response_model=ChallengeFeedback,
    tags=["challenges"],
    summary="Analyze a user's submission using pre-calculated data"
)
def analyze_submission(
    submission: SubmissionIn,
    firebase_service: FirebaseService = Depends(get_firebase_service)
):
    """
    (Logic ใหม่) รับคำตอบจากผู้ใช้, ดึงผลวิเคราะห์ที่เก็บไว้, คำนวณคะแนน, และส่ง Feedback กลับไป
    """
    print("\n--- ANALYZING SUBMISSION (PRE-ANALYZED LOGIC) ---")
    print(f"Received submission data: {submission.dict()}")
    
    try:
        # 1. ดึงข้อมูลข่าวและผลวิเคราะห์ที่เก็บไว้ล่วงหน้าจาก DB
        item_data = get_challenge_item_by_ref(firebase_service, submission.itemRef)
        news_text = item_data.get('text') if item_data else None
        lowercase_clues = [word.lower() for word in submission.userClues]
        

        if not news_text:
            raise HTTPException(status_code=404, detail=f"Item '{submission.itemRef}' not found or has not been analyzed yet.")

        # 1.2 ดึงข้อมูลต่างๆ จาก `analysis_data` ไม่ใช่ `item_data`
        model_prediction_bool = bool(item_data.get("label", 0))
        clues_from_db = item_data.get("clue_words_analysis", [])
        suggestions_from_db = item_data.get("ai_reasoning")

        # 2. อัปเดต 'found_in_reason' ตามเหตุผลที่ผู้ใช้เพิ่งส่งเข้ามา
        updated_clues = []
        # ตรวจสอบให้แน่ใจว่า clues_from_db เป็น list ก่อนวนลูป
        if isinstance(clues_from_db, list):
            for clue in clues_from_db:
                new_clue = clue.copy()
                new_clue['found_in_reason'] = new_clue.get('word', '').lower() in lowercase_clues if submission.userClues else False
                updated_clues.append(new_clue)


        # 3. คำนวณคะแนน
        is_correct = (submission.userLabel == model_prediction_bool)
        final_score = 0

        if is_correct:
            final_score = 25
        
        if updated_clues:
            reasoning_points_pool = 75
            score_per_clue = reasoning_points_pool / len(updated_clues)
            for clue in updated_clues:
                if clue.get("found_in_reason", False):
                    final_score += score_per_clue if is_correct else (score_per_clue / 3)
        
        final_score = min(100, int(final_score))
        
        # 4. สร้าง Feedback
        explanation_text = f"คุณวิเคราะห์ได้ตรงกับ AI! โมเดลเห็นว่านี่คือ '{'ข่าวจริง' if model_prediction_bool else 'ข่าวปลอม'}'" if is_correct else f"มุมมองของคุณต่างจาก AI เล็กน้อย โมเดลวิเคราะห์ว่าเป็น '{'ข่าวจริง' if model_prediction_bool else 'ข่าวปลอม'}'"
        
        # ตรวจสอบให้แน่ใจว่า suggestions_from_db เป็น list ก่อน
        formatted_suggestions = []
        if isinstance(suggestions_from_db, list):
            formatted_suggestions = [{"text": s.get("text")} for s in suggestions_from_db if isinstance(s, dict) and "text" in s]

        final_feedback = {
            "score": final_score, "correct": is_correct, "explanation": explanation_text,
            "clue_words_analysis": updated_clues, "suggestions": formatted_suggestions
        }

        # 5. บันทึกผลการเล่น
        today_date_key = date.today().strftime('%Y-%m-%d')
        # db_submission_data = {"createdAt": int(datetime.utcnow().timestamp() * 1000), "itemRef": f"items/{submission.itemRef}", "userLabel": submission.userLabel, "userReason": submission.userReason, "score": final_score}
        db_submission_data = {"createdAt": int(datetime.utcnow().timestamp() * 1000), "itemRef": f"items/{submission.itemRef}", "userLabel": submission.userLabel, "userClues": ", ".join(submission.userClues), "score": final_score}
        save_submission(firebase_service=firebase_service, user_id=submission.userId, date_key=today_date_key, submission_data=db_submission_data)

        print("--- ANALYSIS COMPLETE (using pre-analyzed data) ---")
        return ChallengeFeedback(**final_feedback)

    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# ====================================================
#  2. ADMIN ENDPOINT: /admin/process
# ====================================================
@router.post(
    "/admin/process",
    response_model=AdminProcessResponse,
    tags=["admin"],
    summary="Process news content for Admin upload (AI analysis only)"
)
def admin_process_content(request: AdminProcessRequest):
    """
    (Logic เก่า) ประมวลผลเนื้อหาข่าวสำหรับ Admin โดยเรียกใช้ AI model แบบ Real-time
    เพื่อสร้างผลวิเคราะห์ไปเก็บใน Database
    """
    print("\n--- ADMIN PROCESSING (REAL-TIME AI) ---")
    try:
        analysis_data = predict_challenge(
            text=request.text, user_label=False, user_reasoning="", urls=[]
        )

        clue_words_analysis = analysis_data.get("clue_words_analysis", [])
        clue_words = [clue.get("word", "") for clue in clue_words_analysis if clue.get("word")]
        
        response = {
            "predicted_label": analysis_data.get("predicted_label", 0),
            "clueWords": clue_words,
            "clue_words_analysis": clue_words_analysis,
            "confidence": analysis_data.get("probability", 0.5),
            "processedAt": int(datetime.utcnow().timestamp() * 1000),
            "suggestions": [{"text": s} for s in analysis_data.get("suggestions", []) if isinstance(s, str)]
        }
        
        print(f"Processed successfully: label={response['predicted_label']}, clueWords={len(clue_words)}")
        return AdminProcessResponse(**response)
        
    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error during admin processing: {e}")

# ====================================================
#  3. UTILITY ENDPOINTS
# ====================================================
@router.get("/challenges/today", response_model=List[Dict[str, Any]], tags=["challenges"])
def get_today_challenges():
    """ดึงรายการโจทย์ทั้งหมดสำหรับวันปัจจุบัน"""
    try:
        challenges = get_challenge_items_for_today()
        if not challenges:
            raise HTTPException(status_code=404, detail="No daily challenges found for today.")
        return challenges 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error during challenge fetch: {e}")

@router.get("/debug-db/{path:path}", tags=["debug"])
def debug_db(path: str, firebase_service: FirebaseService = Depends(get_firebase_service)):
    """Endpoint สำหรับดึงข้อมูลดิบจาก Firebase ตาม Path"""
    data = firebase_service.get_data(path)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Data not found at path: {path}") 
    return data

