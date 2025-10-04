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

  // Helper function to get medal icon
  const getMedalIcon = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏆";
    }
  };

  // Helper function to get rank styling
  const getRankStyling = (index) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg";
      case 1: return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg";
      case 2: return "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg";
      default: return "bg-white text-gray-700 hover:bg-gray-50";
    }
  };

  // Helper function to get accuracy percentage
  const getAccuracy = (attempts, correct) => {
    if (attempts === 0) return 0;
    return Math.round((correct / attempts) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            {view === "daily" ? "Daily Challenge Rankings" : "All-Time Champions"}
          </p>
        </div>


        {/* Toggle View */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setView("daily")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                view === "daily" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              📅 Daily
            </button>
            <button
              onClick={() => setView("all")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                view === "all" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              🏆 All-Time
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card glass hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {view === "daily" ? "Today's Champions" : "Hall of Fame"}
            </h2>
            
            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-xl text-gray-500">No data available yet</div>
                <div className="text-gray-400">Start playing to see rankings!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top 3 Podium */}
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300' :
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300' :
                      'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${getRankStyling(index)}`}>
                          {getMedalIcon(index)}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-600">
                            {user.attempts} attempts • {getAccuracy(user.attempts, user.correct)}% accuracy
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{user.totalScore}</div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{user.correct}/{user.attempts}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            'bg-gradient-to-r from-amber-500 to-amber-700'
                          }`}
                          style={{ width: `${getAccuracy(user.attempts, user.correct)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rest of the rankings */}
                {users.slice(3).map((user, index) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-102 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                          {index + 4}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.attempts} attempts • {getAccuracy(user.attempts, user.correct)}% accuracy
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800">{user.totalScore}</div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Keep playing to climb the leaderboard! 🚀</p>
        </div>
      </div>
    </div>
  );
}
