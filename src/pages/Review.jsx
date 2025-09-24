import React, { useState } from "react";

export default function Review() {
  const [filter, setFilter] = useState("all");

  // Mock data
  const reviewHistory = [
    {
      id: 1,
      title: "นักวิจัยพบสารใหม่ที่อาจรักษามะเร็งได้ 100%",
      date: "2024-01-15",
      userAnswer: false,
      correctAnswer: false,
      aiConfidence: 92,
      userReason: "ใช้คำว่า 100% ที่ไม่สมจริง และไม่มีข้อมูลอ้างอิง",
      domain: "health",
      difficulty: "medium",
      result: "correct"
    },
    {
      id: 2,
      title: "รัฐบาลอนุมัติงบประมาณ 50,000 ล้านบาท สำหรับการศึกษา",
      date: "2024-01-14",
      userAnswer: true,
      correctAnswer: true,
      aiConfidence: 88,
      userReason: "ข้อมูลชัดเจน มีแหล่งข่าวน่าเชื่อถือ",
      domain: "politics",
      difficulty: "easy",
      result: "correct"
    },
    {
      id: 3,
      title: "การค้นพบดาวเคราะห์ใหม่ที่อาจมีสิ่งมีชีวิต",
      date: "2024-01-13",
      userAnswer: true,
      correctAnswer: false,
      aiConfidence: 85,
      userReason: "ข้อมูลวิทยาศาสตร์ดูน่าเชื่อถือ",
      domain: "science",
      difficulty: "hard",
      result: "incorrect"
    }
  ];

  const filteredHistory = filter === "all" 
    ? reviewHistory 
    : reviewHistory.filter(item => item.domain === filter);

  const stats = {
    total: reviewHistory.length,
    correct: reviewHistory.filter(item => item.result === "correct").length,
    accuracy: Math.round((reviewHistory.filter(item => item.result === "correct").length / reviewHistory.length) * 100),
    averageConfidence: Math.round(reviewHistory.reduce((sum, item) => sum + item.aiConfidence, 0) / reviewHistory.length)
  };

  return (
    <main>
      <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
            📊 ประวัติการทดสอบ
          </h1>
          <p style={{ color: "var(--gray-600)" }}>
            ดูผลการทดสอบและเรียนรู้จากข้อที่ทำไปแล้ว
          </p>
        </div>

        {/* Stats Summary */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">ข้อที่ทำแล้ว</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.correct}</span>
            <span className="stat-label">ข้อที่ตอบถูก</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.accuracy}%</span>
            <span className="stat-label">ความแม่นยำ</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.averageConfidence}%</span>
            <span className="stat-label">ความมั่นใจ AI เฉลี่ย</span>
          </div>
        </div>

        {/* Filter */}
        <div className="card">
          <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>🔍 กรองตามหมวดหมู่</h3>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap"
          }}>
            {["all", "health", "politics", "science", "society"].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`btn ${filter === category ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: "0.875rem" }}
              >
                {category === "all" ? "ทั้งหมด" : 
                 category === "health" ? "สุขภาพ" :
                 category === "politics" ? "การเมือง" :
                 category === "science" ? "วิทยาศาสตร์" : "สังคม"}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {filteredHistory.map((item) => (
            <div key={item.id} className="card">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem"
                  }}>
                    <span className="badge" style={{
                      background: item.domain === "health" ? "#ef4444" :
                                  item.domain === "politics" ? "#3b82f6" :
                                  item.domain === "science" ? "#10b981" : "#8b5cf6",
                      color: "white",
                      fontSize: "0.75rem"
                    }}>
                      {item.domain === "health" ? "สุขภาพ" :
                       item.domain === "politics" ? "การเมือง" :
                       item.domain === "science" ? "วิทยาศาสตร์" : "สังคม"}
                    </span>
                    <span className={`badge ${item.difficulty === "easy" ? "badge-success" : 
                                                    item.difficulty === "medium" ? "badge-warning" : "badge-error"}`}>
                      {item.difficulty === "easy" ? "ง่าย" :
                       item.difficulty === "medium" ? "ปานกลาง" : "ยาก"}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
                      {item.date}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 1rem 0", color: "var(--gray-800)", lineHeight: "1.4" }}>
                    {item.title}
                  </h3>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "2rem"
                }}>
                  {item.result === "correct" ? "✅" : "❌"}
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{
                  background: "var(--gray-50)",
                  padding: "1rem",
                  borderRadius: "0.5rem"
                }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--gray-600)" }}>
                    คำตอบของคุณ
                  </h4>
                  <p style={{ margin: "0", fontWeight: "500" }}>
                    {item.userAnswer ? "✅ ข่าวจริง" : "❌ ข่าวปลอม"}
                  </p>
                </div>
                <div style={{
                  background: "var(--gray-50)",
                  padding: "1rem",
                  borderRadius: "0.5rem"
                }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--gray-600)" }}>
                    ความมั่นใจ AI
                  </h4>
                  <p style={{ margin: "0", fontWeight: "500" }}>
                    {item.aiConfidence}%
                  </p>
                </div>
              </div>

              <div style={{
                background: "var(--gray-50)",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--gray-600)" }}>
                  เหตุผลที่คุณให้
                </h4>
                <p style={{ margin: "0", fontStyle: "italic", color: "var(--gray-700)" }}>
                  "{item.userReason}"
                </p>
              </div>

              <div style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end"
              }}>
                <button className="btn btn-secondary" style={{ fontSize: "0.875rem" }}>
                  🔍 ดูคำอธิบายเต็ม
                </button>
                <button className="btn btn-primary" style={{ fontSize: "0.875rem" }}>
                  🔄 ทบทวนอีกครั้ง
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
              ยังไม่มีประวัติการทดสอบ
            </h3>
            <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem" }}>
              เริ่มทำการทดสอบเพื่อดูประวัติและความคืบหน้าของคุณ
            </p>
            <button className="btn btn-primary">
              ⚡ เริ่มทดสอบ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}


