# app/routes/admin_api.py
# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from datetime import datetime

# === Import Dependencies & Logic ===
from app.schemas import AdminProcessRequest, AdminProcessResponse
from app.services.model import predict_challenge
from app.services.db import get_challenge_items_for_today, get_item_by_path

# Optional: ส่วนนี้สำหรับการยืนยันตัวตนของ Admin ผ่าน Firebase
try:
    import firebase_admin
    from firebase_admin import auth as fb_auth
    # ตรวจสอบว่า Firebase App ได้ถูก initialize แล้วหรือยัง
    if not firebase_admin._apps:
        # ควรจะ initialize ในไฟล์หลักของโปรแกรม เช่น main.py
        # firebase_admin.initialize_app()
        print("Firebase Admin SDK not initialized.")
        fb_auth = None
except Exception:
    firebase_admin = None
    fb_auth = None


router = APIRouter()


# ----------------------------------------------------
# 🟢 1. Admin Processing Endpoint
# ----------------------------------------------------
@router.post(
    "/admin/process",
    response_model=AdminProcessResponse,
    tags=["admin"],
    summary="Process news content for Admin upload (AI analysis only)"
)
def admin_process_content(request: AdminProcessRequest):
    """
    รับเนื้อหาข่าวจาก Admin, ประมวลผลด้วย AI model,
    และส่งข้อมูล JSON กลับไปเพื่อให้ Admin นำไปอัปโหลดขึ้น Firebase Realtime Database
    """
    print("\n--- ADMIN PROCESSING ---")
    print(f"Processing: {request.title[:50]}...")
    
    try:
        # วิเคราะห์ด้วยโมเดลโดยไม่ต้องมี user input
        analysis_data = predict_challenge(
            text=request.text,
            user_label=False,
            user_reasoning="",
            urls=[]
        )

        # ดึงผลลัพธ์จากโมเดล
        predicted_label = analysis_data.get("predicted_label", 0)
        confidence = analysis_data.get("confidence", 0.5)
        clue_words_analysis = analysis_data.get("clue_words_analysis", [])
        
        # สร้าง clueWords list จาก clue_words_analysis
        clue_words = []
        if clue_words_analysis:
            clue_words = [clue.get("word", "") for clue in clue_words_analysis if clue.get("word")]
        
        # สร้าง response object ตาม Schema
        response = AdminProcessResponse(
            label=predicted_label,
            clueWords=clue_words,
            clue_words_analysis=clue_words_analysis,
            confidence=confidence,
            processedAt=int(datetime.utcnow().timestamp() * 1000),
            ai_reasoning=analysis_data.get("ai_reasoning", "")
        )
        
        print(f"Processed successfully: label={predicted_label}, clueWords={len(clue_words)}")
        return response
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error during admin processing: {e}"
        )


# ----------------------------------------------------
# 🟢 2. Admin Token Issuance Endpoint
# ----------------------------------------------------
class AdminTokenRequest(BaseModel):
    email: str = Field(..., description="Admin email")

@router.post("/admin/token", tags=["admin"], summary="Issue Firebase Custom Token for Admin")
def issue_admin_token(payload: AdminTokenRequest):
    """
    สร้าง Firebase Custom Token สำหรับ Admin Email ที่ระบุ
    เพื่อให้ Frontend (หน้า Admin) ใช้ยืนยันตัวตนก่อนเขียนข้อมูลลง Database
    """
    if fb_auth is None:
        raise HTTPException(status_code=500, detail="Firebase Admin SDK not available or not initialized.")

    try:
        uid = f"admin:{payload.email}"
        # ตรวจสอบว่ามี user นี้ใน Firebase Authentication หรือยัง, ถ้ายังก็สร้างใหม่
        try:
            fb_auth.get_user(uid)
        except Exception:
            fb_auth.create_user(uid=uid, email=payload.email, display_name="Admin")

        custom_token = fb_auth.create_custom_token(uid)
        return {"token": custom_token.decode("utf-8") if hasattr(custom_token, "decode") else custom_token}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to issue admin token: {e}")


# ----------------------------------------------------
# 🟢 3. Data Fetching Endpoints (Optional)
# ----------------------------------------------------
@router.get("/challenges/today", response_model=List[Dict[str, Any]], tags=["challenges"], summary="Get today's challenges")
def get_today_challenges():
    """
    ดึงรายการโจทย์ทั้งหมดสำหรับวันปัจจุบันจาก Firebase (มีประโยชน์ไว้ดูข้อมูล)
    """
    try:
        challenges = get_challenge_items_for_today()
        if not challenges:
            # เปลี่ยนเป็น return list ว่างแทน 404 เพื่อให้ Frontend จัดการง่ายขึ้น
            return []
        return challenges
    except Exception as e:
        print(f"Error fetching daily challenges: {e}")
        raise HTTPException(status_code=500, detail="Internal error during challenge fetch.")

@router.get("/debug-db/{path:path}", tags=["debug"], summary="Fetch raw data from Firebase by path")
def debug_db(path: str):
    """
    Endpoint สำหรับดึงข้อมูลดิบจาก Firebase ตามพาธที่ระบุ (สำหรับ Debug)
    """
    data = get_item_by_path(path)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Data not found at path: {path}")
    return data