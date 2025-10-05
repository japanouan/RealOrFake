"""
Backend - ใส่ใน Backend/app/routes/leaderboard.py
แก้ไขให้ดึง displayName จาก users table
"""

from flask import Blueprint, jsonify
from firebase_admin import db
from datetime import datetime
import time

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/update', methods=['POST'])
def update_leaderboard():
    """
    อ่านจาก userAggregates → ดึง displayName จาก users → เขียนลง leaderboards
    """
    try:
        # 1. ดึงข้อมูลจาก userAggregates และ users
        user_agg = db.reference('userAggregates').get() or {}
        users = db.reference('users').get() or {}
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        # 2. เตรียมข้อมูล All-time
        all_time = []
        for uid, agg in user_agg.items():
            all_stats = agg.get('all', {})
            if all_stats.get('totalScore', 0) > 0:
                # ดึง displayName จาก users table
                user_profile = users.get(uid, {})
                display_name = user_profile.get('displayName', 'Unknown User')
                
                all_time.append({
                    'uid': uid,
                    'displayName': display_name,  # ✅ เพิ่ม displayName
                    'totalScore': all_stats.get('totalScore', 0),
                    'correct': all_stats.get('correct', 0),
                    'attempts': all_stats.get('attempts', 0)
                })
        
        # 3. เตรียมข้อมูล Daily
        daily = []
        for uid, agg in user_agg.items():
            daily_stats = agg.get('daily', {}).get(today, {})
            if daily_stats.get('totalScore', 0) > 0:
                # ดึง displayName จาก users table
                user_profile = users.get(uid, {})
                display_name = user_profile.get('displayName', 'Unknown User')
                
                daily.append({
                    'uid': uid,
                    'displayName': display_name,  # ✅ เพิ่ม displayName
                    'totalScore': daily_stats.get('totalScore', 0),
                    'correct': daily_stats.get('correct', 0),
                    'attempts': daily_stats.get('attempts', 0)
                })
        
        # 4. เรียงลำดับ
        all_time.sort(key=lambda x: x['totalScore'], reverse=True)
        daily.sort(key=lambda x: x['totalScore'], reverse=True)
        
        # 5. บันทึกลง leaderboards
        timestamp = int(time.time() * 1000)
        
        # All-time (เก็บ top 100)
        all_top = {str(i): user for i, user in enumerate(all_time[:100])}
        db.reference('leaderboards/all').set({
            'top': all_top,
            'updatedAt': timestamp,
            'totalUsers': len(all_time)
        })
        
        # Daily (เก็บ top 50)
        daily_top = {str(i): user for i, user in enumerate(daily[:50])}
        db.reference(f'leaderboards/daily/{today}').set({
            'top': daily_top,
            'updatedAt': timestamp,
            'totalUsers': len(daily)
        })
        
        print(f"✅ Leaderboard updated: All-time={len(all_time)}, Daily={len(daily)}")
        
        return jsonify({
            "success": True,
            "message": "Leaderboard updated",
            "allTime": len(all_time),
            "daily": len(daily)
        }), 200
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500