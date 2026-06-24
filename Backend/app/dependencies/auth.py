# app/dependencies/auth.py
from fastapi import Header, HTTPException, Depends
from firebase_admin import auth as fb_auth, db as rtdb

# Import เพื่อให้แน่ใจว่า Firebase Admin SDK ถูก initialize แล้ว (initialize_firebase() รันตอน import module นี้)
from app.services import db as _db_service  # noqa: F401


def get_current_user(authorization: str = Header(None)) -> dict:
    """Verify Firebase ID token จาก Authorization header แล้วคืน decoded claims (มี uid, email)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1]
    try:
        return fb_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """ตรวจสอบว่า uid ที่ verify แล้วมี role เป็น admin จริงใน Realtime Database"""
    role = rtdb.reference(f"users/{user['uid']}/role").get()
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin role required")
    return user
