import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [view, setView] = useState("daily"); // "daily" | "all"

  useEffect(() => {
    const db = getDatabase();
    const aggRef = ref(db, "userAggregates");
    const usersRef = ref(db, "users");

    const unsubscribeAgg = onValue(aggRef, (snapshot) => {
      if (!snapshot.exists()) {
        setUsers([]);
        setTotalUsers(0);
        return;
      }

      const aggData = snapshot.val();

      // เอาวันปัจจุบัน (yyyy-mm-dd)
      const today = new Date().toISOString().split("T")[0];

      // ไปดึง users เพื่อ map displayName
      onValue(usersRef, (snapUsers) => {
        const usersData = snapUsers.exists() ? snapUsers.val() : {};

        const usersArray = Object.entries(aggData).map(([uid, agg]) => {
          const userProfile = usersData[uid] || {};
          let stats;

          if (view === "daily") {
            stats = agg.daily?.[today] || { attempts: 0, correct: 0, totalScore: 0 };
          } else {
            stats = agg.all || { attempts: 0, correct: 0, totalScore: 0 };
          }

          return {
            id: uid,
            name: userProfile.displayName || "ไม่ระบุชื่อ",
            attempts: stats.attempts || 0,
            correct: stats.correct || 0,
            totalScore: stats.totalScore || 0,
          };
        });

        // sort ตาม totalScore
        usersArray.sort((a, b) => b.totalScore - a.totalScore);

        setUsers(usersArray);
        setTotalUsers(usersArray.length);
      });
    });

    return () => unsubscribeAgg();
  }, [view]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🏆 Daily Challenge Leaderboard</h1>

      {/* Toggle View */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setView("daily")}
          className={`px-4 py-2 rounded ${
            view === "daily" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded ${
            view === "all" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
        >
          All-Time
        </button>
      </div>

      <p className="mb-4">จำนวนผู้ใช้ทั้งหมด: {totalUsers}</p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">อันดับ</th>
            <th className="p-2">ชื่อผู้ใช้</th>
            <th className="p-2">Attempts</th>
            <th className="p-2">Correct</th>
            <th className="p-2">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.attempts}</td>
              <td className="p-2">{u.correct}</td>
              <td className="p-2">{u.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
