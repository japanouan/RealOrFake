import React, { useState } from "react";
import { Trophy, Medal, Crown, Star, TrendingUp, Award, Target, Zap } from "lucide-react";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("weekly");

  const tabs = [
    { id: "weekly", label: "สัปดาห์นี้", icon: TrendingUp },
    { id: "monthly", label: "เดือนนี้", icon: Trophy },
    { id: "alltime", label: "ตลอดกาล", icon: Crown }
  ];

  const leaderboardData = {
    weekly: [
      { rank: 1, name: "TruthSeeker", accuracy: 95, streak: 7, points: 850, badge: "Crown" },
      { rank: 2, name: "FactChecker", accuracy: 92, streak: 6, points: 780, badge: "Gold" },
      { rank: 3, name: "NewsGuard", accuracy: 90, streak: 5, points: 720, badge: "Silver" },
      { rank: 4, name: "VerifyMaster", accuracy: 88, streak: 4, points: 680, badge: "Bronze" },
      { rank: 5, name: "InfoDetective", accuracy: 85, streak: 3, points: 650, badge: "Bronze" }
    ],
    monthly: [
      { rank: 1, name: "TruthSeeker", accuracy: 94, streak: 28, points: 3200, badge: "Crown" },
      { rank: 2, name: "FactChecker", accuracy: 91, streak: 25, points: 2900, badge: "Gold" },
      { rank: 3, name: "NewsGuard", accuracy: 89, streak: 22, points: 2700, badge: "Silver" },
      { rank: 4, name: "VerifyMaster", accuracy: 87, streak: 20, points: 2500, badge: "Bronze" },
      { rank: 5, name: "InfoDetective", accuracy: 84, streak: 18, points: 2300, badge: "Bronze" }
    ],
    alltime: [
      { rank: 1, name: "TruthSeeker", accuracy: 93, streak: 365, points: 45000, badge: "Crown" },
      { rank: 2, name: "FactChecker", accuracy: 90, streak: 320, points: 42000, badge: "Gold" },
      { rank: 3, name: "NewsGuard", accuracy: 88, streak: 280, points: 39000, badge: "Silver" },
      { rank: 4, name: "VerifyMaster", accuracy: 86, streak: 250, points: 36000, badge: "Bronze" },
      { rank: 5, name: "InfoDetective", accuracy: 83, streak: 220, points: 33000, badge: "Bronze" }
    ]
  };

  const achievements = [
    {
      id: 1,
      title: "Truth Seeker",
      description: "ทำความแม่นยำ 90% ขึ้นไป 7 วันติดต่อกัน",
      icon: Target,
      unlocked: true,
      progress: 100
    },
    {
      id: 2,
      title: "Streak Master",
      description: "ทำ Daily Challenge 30 วันติดต่อกัน",
      icon: Zap,
      unlocked: false,
      progress: 70
    },
    {
      id: 3,
      title: "Accuracy King",
      description: "ทำความแม่นยำ 95% ขึ้นไปใน 1 สัปดาห์",
      icon: Award,
      unlocked: false,
      progress: 45
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Crown":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "Gold":
        return "bg-gradient-to-r from-yellow-500 to-yellow-700";
      case "Silver":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "Bronze":
        return "bg-gradient-to-r from-amber-600 to-amber-800";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-700";
    }
  };

  const currentData = leaderboardData[activeTab];

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">อันดับและความสำเร็จ</h1>
          <p className="text-lg text-gray-600">แข่งขันกับผู้ใช้คนอื่นและปลดล็อกความสำเร็จใหม่ๆ</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="flex">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
  activeTab === tab.id
    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
    : "text-gray-700 hover:text-blue-600"
}`}

                    >
                      <IconComponent className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">🏆 อันดับ{activeTab === "weekly" ? "สัปดาห์นี้" : activeTab === "monthly" ? "เดือนนี้" : "ตลอดกาล"}</h2>
                <p className="opacity-90">ผู้เล่นที่มีผลงานดีที่สุด</p>
              </div>

              <div className="divide-y divide-gray-100">
                {currentData.map((player, index) => (
                  <div key={index} className={`p-6 flex items-center space-x-6 ${
                    player.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                  }`}>
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(player.rank)}
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getBadgeColor(player.badge)}`}>
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(player.badge)} text-white`}>
                          {player.badge}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{player.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">คะแนน</div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">{player.accuracy}%</div>
                      <div className="text-sm text-gray-600">ความแม่นยำ</div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">{player.streak}</div>
                      <div className="text-sm text-gray-600">วันติดต่อกัน</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements & Stats */}
          <div className="space-y-8">
            {/* Personal Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">สถิติของคุณ</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">อันดับปัจจุบัน</span>
                  <span className="text-2xl font-bold text-gray-900">#15</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">คะแนนรวม</span>
                  <span className="text-2xl font-bold text-gray-900">2,450</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ความแม่นยำ</span>
                  <span className="text-2xl font-bold text-green-600">87%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Streak ปัจจุบัน</span>
                  <span className="text-2xl font-bold text-blue-600">12 วัน</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">ความก้าวหน้า</span>
                  <span className="text-sm font-medium text-gray-900">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000" style={{width: '87%'}}></div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">ความสำเร็จ</h3>
              
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={achievement.id} className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gray-300'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            achievement.unlocked ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.unlocked ? (
                          <Star className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <span className="text-xs text-gray-400">{achievement.progress}%</span>
                        )}
                      </div>
                      
                      {!achievement.unlocked && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{width: `${achievement.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">เพิ่มอันดับของคุณ</h3>
              <p className="text-blue-100 mb-6">
                ทำ Daily Challenge ทุกวันเพื่อเพิ่มคะแนนและความแม่นยำ
              </p>
              <button className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                เริ่ม Daily Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}