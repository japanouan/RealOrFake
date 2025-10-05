# app/routes/learn.py
from fastapi import APIRouter
from typing import Dict, List
from app.services.firebase_service import FirebaseService
from app.services.db import get_challenge_item_by_ref, get_firebase_service
from core.config import settings

router = APIRouter()
firebase_service = FirebaseService(settings=settings)

@router.get("/items", response_model=List)
def get_challenge_items():
    """
    ดึงหรือสร้าง Daily Challenge ของวันนี้
    - count: จำนวน item ที่ต้องการสุ่ม (default=3)
    """
    # สร้าง List ว่างสำหรับเก็บผลลัพธ์ 
    all_item_refs = set()
    news_items = []

    challengePath = firebase_service.root_ref.child(f"dailyChallenges")
    challenge = challengePath.get()
    # print(challenge)
    for dateKey in challenge.values():
        # print(dateKey)
        for item in dateKey["items"].values():
            print(item["itemRef"])
            all_item_refs.add(item["itemRef"])

    # เลือก key ที่ต้องการใช้
    keys_to_keep = ['ai_reasoning', 'domain', 'label', 'text', 'clueWords']

    print(all_item_refs)
    for item_ref in all_item_refs:
        record = get_challenge_item_by_ref(get_firebase_service(), item_ref)
        if record is not None:
            {key: record[key] for key in keys_to_keep}
            news_items.append(record)

    return news_items
