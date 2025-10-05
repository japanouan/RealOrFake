# app/routes/daily.py
from fastapi import APIRouter
from typing import Dict
from app.services.firebase_service import FirebaseService
from core.config import settings

router = APIRouter()
firebase_service = FirebaseService(settings=settings)

@router.get("/daily/today", response_model=Dict)
def daily_challenge(count: int = 3):
    """
    ดึงหรือสร้าง Daily Challenge ของวันนี้
    - count: จำนวน item ที่ต้องการสุ่ม (default=3)
    """
    challenge = firebase_service.generate_daily_challenge(count=count)
    if not challenge:
        return {"error": "Cannot generate daily challenge today."}
    return challenge
