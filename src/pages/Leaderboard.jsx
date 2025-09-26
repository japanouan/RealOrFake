import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // แปลง object -> array
        const usersArray = Object.entries(data).map(([uid, user]) => ({
          id: uid,
          name: user.displayName || 'ไม่ระบุชื่อ',
          email: user.email || '',
          correct: user.stats?.correct ?? 0,
          attempts: user.stats?.attempts ?? 0,
          f1: user.stats?.f1 ?? 0,
          streak: user.stats?.streak ?? 0,
          longestStreak: user.longestStreak ?? 0,
        }));

        // เรียงลำดับตามจำนวน correct (ปรับเป็น f1 หรือ streak ได้)
        usersArray.sort((a, b) => b.correct - a.correct);

        setUsers(usersArray);
        setTotalUsers(usersArray.length);
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>
      <p className="mb-4">จำนวนผู้ใช้ทั้งหมด: {totalUsers}</p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">อันดับ</th>
            <th className="p-2">ชื่อผู้ใช้</th>
            <th className="p-2">ถูกต้อง</th>
            <th className="p-2">พยายาม</th>
            <th className="p-2">F1</th>
            <th className="p-2">Streak</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.correct}</td>
              <td className="p-2">{u.attempts}</td>
              <td className="p-2">{u.f1}</td>
              <td className="p-2">{u.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
