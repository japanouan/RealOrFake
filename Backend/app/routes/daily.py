# app/routes/daily.py
from fastapi import APIRouter, Query, Depends
from typing import Dict, List
from app.services.db import generate_daily_challenge, get_submissions_for_today, get_firebase_service

router = APIRouter()

@router.get("/dailychallenges/today", response_model=Dict)
def daily_challenge(
    count: int = 5,
    firebase_service = Depends(get_firebase_service)
):
    """
    ดึงหรือสร้าง Daily Challenge ของวันนี้
    """
    challenge = generate_daily_challenge(firebase_service, count=count)
    if not challenge:
        return {"error": "Cannot generate daily challenge today."}
    return challenge

