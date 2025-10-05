from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from rich import _console
from firebase_admin import db
from datetime import datetime
import time
import traceback

router = APIRouter()

@router.post("/update")
async def update_leaderboard(type: str = Query("both", description="Type: daily, all, or both")):
    """
    อ่านจาก userAggregates → ดึง displayName จาก users → เขียนลง leaderboards
    
    Args:
        type: "daily", "all", หรือ "both" (default: "both")
    
    Returns:
        JSON response with success status and counts
    """
    try:
        # 1. ดึงข้อมูล
        user_agg = db.reference('userAggregates').get() or {}
        users = db.reference('users').get() or {}
        
        if not user_agg:
            return JSONResponse(content={
                "success": True,
                "message": "No user aggregates data found",
                "allTime": 0,
                "daily": 0
            }, status_code=200)
        
        today = datetime.now().strftime("%Y-%m-%d")
        timestamp = int(time.time() * 1000)
        
        all_time = []
        daily = []
        
        # 2. ประมวลผล All-time
        if type in ["all", "both"]:
            for uid, agg in user_agg.items():
                all_stats = agg.get('all', {})
                if all_stats.get('totalScore', 0) > 0:
                    user_profile = users.get(uid, {})
                    username = user_profile.get('username')
                    display_name = user_profile.get('displayName')
                    
                    all_time.append({
                        'uid': uid,
                        'displayName': display_name or username,
                        'totalScore': all_stats.get('totalScore', 0),
                        'correct': all_stats.get('correct', 0),
                        'attempts': all_stats.get('attempts', 0)
                    })
            
            all_time.sort(key=lambda x: x['totalScore'], reverse=True)
            
            # บันทึก All-time
            all_top = {str(i): user for i, user in enumerate(all_time[:100])}
            db.reference('leaderboards/all').set({
                'top': all_top,
                'updatedAt': timestamp,
                'totalUsers': len(all_time)
            })
            print(f"✅ All-time leaderboard updated: {len(all_time)} users")
        
        # 3. ประมวลผล Daily
        if type in ["daily", "both"]:
            for uid, agg in user_agg.items():
                daily_stats = agg.get('daily', {}).get(today, {})
                if daily_stats.get('totalScore', 0) > 0:
                    user_profile = users.get(uid, {})
                    display_name = user_profile.get('displayName')
                    username = user_profile.get('username')
                    
                    daily.append({
                        'uid': uid,
                        'displayName': display_name or username,
                        'totalScore': daily_stats.get('totalScore', 0),
                        'correct': daily_stats.get('correct', 0),
                        'attempts': daily_stats.get('attempts', 0)
                    })
            
            daily.sort(key=lambda x: x['totalScore'], reverse=True)
            
            # บันทึก Daily
            daily_top = {str(i): user for i, user in enumerate(daily[:50])}
            db.reference(f'leaderboards/daily/{today}').set({
                'top': daily_top,
                'updatedAt': timestamp,
                'totalUsers': len(daily)
            })
            print(f"✅ Daily leaderboard updated: {len(daily)} users")
        
        return JSONResponse(content={
            "success": True,
            "message": "Leaderboard updated successfully",
            "allTime": len(all_time) if type in ["all", "both"] else None,
            "daily": len(daily) if type in ["daily", "both"] else None,
            "timestamp": timestamp
        }, status_code=200)
        
    except Exception as e:
        print(f"❌ Error updating leaderboard: {str(e)}")
        traceback.print_exc()
        
        return JSONResponse(content={
            "success": False,
            "message": "Failed to update leaderboard",
            "error": str(e)
        }, status_code=500)