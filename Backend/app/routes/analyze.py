# app/routes/analyze.py
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import date, datetime
import re

from app.routes.leaderboard import update_leaderboard

# === Import Dependencies & Logic ===
from app.schemas import ChallengeFeedback, SubmissionIn
from app.services.db import get_firebase_service, get_challenge_item_by_ref, save_submission, get_current_streak_status
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
            "clue_words_analysis": updated_clues, "suggestions": formatted_suggestions,
            "ai_reasoning": suggestions_from_db
        }

        # 5. บันทึกผลการเล่น
        today_date_key = date.today().strftime('%Y-%m-%d')
        # db_submission_data = {"createdAt": int(datetime.utcnow().timestamp() * 1000), "itemRef": f"items/{submission.itemRef}", "userLabel": submission.userLabel, "userReason": submission.userReason, "score": final_score}
        db_submission_data = {"createdAt": int(datetime.utcnow().timestamp() * 1000), "itemRef": f"items/{submission.itemRef}", "userLabel": submission.userLabel, "userClues": ", ".join(submission.userClues), "score": final_score, "is_correct":is_correct}
        save_submission(firebase_service=firebase_service, user_id=submission.userId, date_key=today_date_key, submission_data=db_submission_data)

        # 2. อัปเดต User Aggregates
        # user_agg_ref = firebase_service.child(f"userAggregates/{submission.userId}")
        user_agg_all = firebase_service.root_ref.child(f"userAggregates/{submission.userId}/all")
        user_agg_daily = firebase_service.root_ref.child(f"userAggregates/{submission.userId}/daily/{today_date_key}")
        user_stats = firebase_service.root_ref.child(f"users/{submission.userId}/stats")
        current_user_stats = user_stats.get() or { "accuracy": 0, "correctAnswers": 0, "streak": 0, "totalQuestions": 0}
        current_all_aggregates = user_agg_all.get() or { "attempts": 0, "correct": 0, "totalScore": 0}
        current_daily_aggregates = user_agg_daily.get() or { "attempts": 0, "correct": 0, "totalScore": 0}

        # อัปเดต User Aggregates ตามคะแนน
        current_all_aggregates["totalScore"] += final_score
        current_all_aggregates["attempts"] += 1
        current_daily_aggregates["totalScore"] += final_score
        current_daily_aggregates["attempts"] += 1
        current_user_stats["totalQuestions"] += 1

        if is_correct:
            current_all_aggregates["correct"] += 1
            current_daily_aggregates["correct"] += 1
            current_user_stats["correctAnswers"] += 1

        # อัปเดต streak
        submission_history_data  = firebase_service.root_ref.child(f"submissions/{submission.userId}").get() 
        date_keys = submission_history_data.keys() if submission_history_data else []
        streak = get_current_streak_status(date_keys)
        current_user_stats["streak"] = streak

        # คำนวณ accuracy จาก correctAnswers/totalQuestions
        try:
            attempts_for_accuracy = int(current_user_stats.get("totalQuestions", 0))
            correct_for_accuracy = int(current_user_stats.get("correctAnswers", 0))
            current_user_stats["accuracy"] = round((correct_for_accuracy / attempts_for_accuracy) * 100, 2) if attempts_for_accuracy > 0 else 0
        except Exception:
            current_user_stats["accuracy"] = 0

        # อัปเดต User Aggregates ลง Firebase
        user_agg_all.set(current_all_aggregates)
        user_agg_daily.set(current_daily_aggregates)
        user_stats.set(current_user_stats)

        # อัปเดต leaderboard (ไม่รอผลลัพธ์แบบ async ใน path นี้)
        try:
            update_leaderboard(type="both")
        except Exception:
            pass


        print("--- ANALYSIS COMPLETE (using pre-analyzed data) ---")
        return ChallengeFeedback(**final_feedback)

    except Exception as e:
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# Admin endpoints moved to analyzeAdmin.py

# ====================================================
#  3. UTILITY ENDPOINTS
#  - /challenges/today และ /debug-db ถูกย้ายไปอยู่ที่ app/routes/admin.py
#    (mount ใต้ /api/v1 และมี require_admin guard) เพื่อไม่ให้ซ้ำซ้อนและไม่มี auth หลุดมาบัง route ที่ป้องกันแล้ว
# ====================================================

