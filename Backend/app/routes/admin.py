# app/routes/admin_api.py
# -*- coding: utf-8 -*-
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime

# === Import Dependencies & Logic ===
from app.schemas import AdminProcessRequest, AdminProcessResponse
from app.services.model import predict_challenge
from app.services.db import get_item_by_path
from app.dependencies.auth import require_admin

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
def admin_process_content(request: AdminProcessRequest, _user: dict = Depends(require_admin)):
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
# 🟢 2. Data Fetching Endpoints (Optional)
# ----------------------------------------------------
@router.get("/debug-db/{path:path}", tags=["debug"], summary="Fetch raw data from Firebase by path")
def debug_db(path: str, _user: dict = Depends(require_admin)):
    """
    Endpoint สำหรับดึงข้อมูลดิบจาก Firebase ตามพาธที่ระบุ (สำหรับ Debug)
    """
    data = get_item_by_path(path)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Data not found at path: {path}")
    return data