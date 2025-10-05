import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onValue, get } from 'firebase/database';

const API_URL = "http://localhost:5000/api/v1/leaderboard";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [view, setView] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const hasInitialized = useRef(false);

  // ฟังก์ชันเรียก Backend เพื่ออัปเดต leaderboard
  const updateLeaderboard = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/update?type=both`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (result.success) {
        setLastUpdate(new Date());
        console.log('✅ Leaderboard updated:', result);
      } else {
        console.error('❌ Failed to update:', result);
        alert('Failed to update leaderboard');
      }
    } catch (error) {
      console.error('❌ Error updating leaderboard:', error);
      alert('Cannot connect to Backend\nPlease check if server is running on port 5000');
    } finally {
      setUpdating(false);
    }
  };

  // ดึงข้อมูลจาก Firebase Realtime Database
  useEffect(() => {
    const db = getDatabase();
    const today = new Date().toISOString().split("T")[0];
    
    const path = view === "daily" 
      ? `leaderboards/daily/${today}`
      : 'leaderboards/all';
    
    const leaderboardRef = ref(db, path);
    const usersRef = ref(db, 'users');

    setLoading(true);

    const unsubscribe = onValue(leaderboardRef, async (snapshot) => {
      if (!snapshot.exists()) {
        setUsers([]);
        setTotalUsers(0);
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const topUsers = data.top || {};

      try {
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.exists() ? usersSnapshot.val() : {};

        const usersArray = Object.entries(topUsers).map(([rank, userData]) => {
          const userProfile = usersData[userData.uid] || {};
          const displayName = userData.displayName || userProfile.displayName || "ไม่ระบุชื่อ";

          return {
            id: userData.uid,
            name: displayName,
            attempts: userData.attempts || 0,
            correct: userData.correct || 0,
            totalScore: userData.totalScore || 0,
            rank: parseInt(rank) + 1
          };
        });

        usersArray.sort((a, b) => a.rank - b.rank);

        setUsers(usersArray);
        setTotalUsers(data.totalUsers || usersArray.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [view]);

  // เรียก update ครั้งแรกเมื่อโหลดหน้า
  useEffect(() => {
    if (!hasInitialized.current) {
      updateLeaderboard();
      hasInitialized.current = true;
    }
  }, []);

  const getMedalIcon = (index) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏆";
    }
  };

  const getRankStyling = (index) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg";
      case 1: return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg";
      case 2: return "bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg";
      default: return "bg-white text-gray-700 hover:bg-gray-50";
    }
  };

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
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdate.toLocaleTimeString('th-TH')}
            </p>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={updateLeaderboard}
            disabled={updating}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                🔄 Refresh Leaderboard
              </>
            )}
          </button>
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
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : users.length === 0 ? (
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
                        <div className="text-2xl font-bold text-gray-800">{user.totalScore.toLocaleString()}</div>
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
                        <div className="text-xl font-bold text-gray-800">{user.totalScore.toLocaleString()}</div>
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
          {totalUsers > 0 && (
            <p className="text-sm mt-2">Total players: {totalUsers}</p>
          )}
        </div>
      </div>
    </div>
  );
}