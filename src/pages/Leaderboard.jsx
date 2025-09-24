import React, { useState } from "react";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Mock data
  const leaderboardData = [
    { rank: 1, name: "ผู้ใช้ A", streak: 30, accuracy: 95, badges: 8, avatar: "🥇" },
    { rank: 2, name: "ผู้ใช้ B", streak: 25, accuracy: 92, badges: 6, avatar: "🥈" },
    { rank: 3, name: "ผู้ใช้ C", streak: 20, accuracy: 89, badges: 5, avatar: "🥉" },
    { rank: 4, name: "ผู้ใช้ D", streak: 15, accuracy: 87, badges: 4, avatar: "🏅" },
    { rank: 5, name: "คุณ", streak: 7, accuracy: 85, badges: 3, avatar: "👤" },
  ];

  const achievements = [
    { id: 1, title: "🔥 Fire Starter", description: "ทำ streak 7 วันติด", icon: "🔥", unlocked: true, progress: 100 },
    { id: 2, title: "💎 Diamond Detective", description: "ทำ streak 30 วันติด", icon: "💎", unlocked: false, progress: 23 },
    { id: 3, title: "🎯 Sharp Shooter", description: "ความแม่นยำ 95% ขึ้น", icon: "🎯", unlocked: false, progress: 85 },
    { id: 4, title: "🧠 Critical Thinker", description: "ทำข้อทดสอบ 100 ข้อ", icon: "🧠", unlocked: false, progress: 15 },
    { id: 5, title: "📚 Knowledge Seeker", description: "อ่านบทความเรียนรู้ 50 บทความ", icon: "📚", unlocked: false, progress: 20 },
    { id: 6, title: "🌟 Super Star", description: "ติดอันดับ 1 ในรอบสัปดาห์", icon: "🌟", unlocked: false, progress: 0 },
  ];

  const badges = [
    { id: 1, title: "ข่าวสุขภาพ", icon: "🏥", count: 5, description: "ผ่านการทดสอบข่าวสุขภาพ 5 ข้อ" },
    { id: 2, title: "ข่าวการเมือง", icon: "🏛️", count: 3, description: "ผ่านการทดสอบข่าวการเมือง 3 ข้อ" },
    { id: 3, title: "ข่าววิทยาศาสตร์", icon: "🔬", count: 2, description: "ผ่านการทดสอบข่าววิทยาศาสตร์ 2 ข้อ" },
  ];

  return (
    <main>
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
            🏆 Leaderboard & Achievements
          </h1>
          <p style={{ color: "var(--gray-600)" }}>
            ติดตามความคืบหน้าและแข่งขันกับเพื่อน
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          background: "var(--gray-100)",
          padding: "0.25rem",
          borderRadius: "0.5rem"
        }}>
          <button
            onClick={() => setActiveTab("leaderboard")}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.25rem",
              background: activeTab === "leaderboard" ? "white" : "transparent",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            🏆 อันดับ
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.25rem",
              background: activeTab === "achievements" ? "white" : "transparent",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            🎖️ ภารกิจ
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.25rem",
              background: activeTab === "badges" ? "white" : "transparent",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            🏅 เหรียญตรา
          </button>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                🏆 อันดับผู้เล่น
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {leaderboardData.map((player, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      background: player.name === "คุณ" ? "var(--primary-color)" : "var(--gray-50)",
                      color: player.name === "คุณ" ? "white" : "var(--gray-800)",
                      borderRadius: "0.5rem",
                      border: player.name === "คุณ" ? "2px solid var(--primary-color)" : "none"
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", minWidth: "2rem" }}>
                      {player.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
                        {player.name}
                      </h3>
                      <div style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        opacity: 0.8
                      }}>
                        <span>🔥 {player.streak} วัน</span>
                        <span>🎯 {player.accuracy}%</span>
                        <span>🏅 {player.badges}</span>
                      </div>
                    </div>
                    <div style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: player.rank <= 3 ? "var(--warning-color)" : "inherit"
                    }}>
                      #{player.rank}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="card">
              <h3 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                📊 สถิติสัปดาห์นี้
              </h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">156</span>
                  <span className="stat-label">ผู้เล่นที่เข้าร่วม</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">87%</span>
                  <span className="stat-label">ความแม่นยำเฉลี่ย</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">12</span>
                  <span className="stat-label">Streak สูงสุด</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">45</span>
                  <span className="stat-label">Badge ใหม่</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                🎖️ ภารกิจและความสำเร็จ
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem",
                      background: achievement.unlocked ? "var(--success-color)" : "var(--gray-50)",
                      color: achievement.unlocked ? "white" : "var(--gray-800)",
                      borderRadius: "0.5rem",
                      border: achievement.unlocked ? "2px solid var(--success-color)" : "1px solid var(--gray-200)"
                    }}
                  >
                    <div style={{ fontSize: "2rem" }}>{achievement.icon}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem" }}>
                        {achievement.title}
                      </h3>
                      <p style={{ margin: "0 0 0.5rem 0", opacity: 0.8, fontSize: "0.9rem" }}>
                        {achievement.description}
                      </p>
                      <div style={{
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "0.25rem",
                        height: "0.5rem",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          background: "white",
                          height: "100%",
                          width: `${achievement.progress}%`,
                          transition: "width 0.3s ease"
                        }}></div>
                      </div>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", opacity: 0.7 }}>
                        {achievement.progress}%
                      </p>
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>
                      {achievement.unlocked ? "✅" : "🔒"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                🏅 เหรียญตราและความสำเร็จ
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem"
              }}>
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    style={{
                      textAlign: "center",
                      padding: "1.5rem",
                      background: "var(--gray-50)",
                      borderRadius: "1rem",
                      border: "2px solid var(--gray-200)"
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                      {badge.icon}
                    </div>
                    <h3 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
                      {badge.title}
                    </h3>
                    <p style={{ marginBottom: "1rem", color: "var(--gray-600)", fontSize: "0.9rem" }}>
                      {badge.description}
                    </p>
                    <div className="badge badge-success">
                      {badge.count} ข้อ
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Summary */}
            <div className="card">
              <h3 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                📈 ความคืบหน้าของคุณ
              </h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">7</span>
                  <span className="stat-label">Streak วัน</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">15</span>
                  <span className="stat-label">ข้อที่ทำแล้ว</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">85%</span>
                  <span className="stat-label">ความแม่นยำ</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Badge ที่ได้</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


