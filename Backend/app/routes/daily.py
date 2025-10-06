# app/routes/daily.py
from fastapi import APIRouter, Query, Depends
from typing import Dict, List
from app.services.db import generate_daily_challenge, get_firebase_service
from datetime import date

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

@router.get("/dailychallenges/today/index/", response_model=int)
def daily_challenge_index(
    user_id: str,
    firebase_service = Depends(get_firebase_service),
):
    """
    ดึงหรือสร้าง Daily Challenge ของวันนี้
    """
    today_date_key = date.today().strftime('%Y-%m-%d') 
    submissions = firebase_service.root_ref.child(f"submissions/{user_id}/{today_date_key}").get() 
    print(f'this is submissions {submissions}')
    if not submissions:
        return 0
    max_valid_index = 0
    # วนลูปจาก index สูงสุดลงมา เพื่อหา index แรกที่ไม่ใช่ None
    for i in range(len(submissions)):
        if submissions[i] is not None:
            max_valid_index += 1
    print(f'this is max_valid_index {max_valid_index}')
    return max_valid_index

@router.get("/dailychallenges/today/limit/", response_model=int)
def daily_challenge_index(
    firebase_service = Depends(get_firebase_service),
):
    """
    ดึงหรือสร้าง Daily Challenge ของวันนี้
    """
    today_date_key = date.today().strftime('%Y-%m-%d') 
    submissions = firebase_service.root_ref.child(f"dailyChallenges/{today_date_key}").get() 
    print(f'Today limit is {submissions["count"]}')
    return submissions["count"]

