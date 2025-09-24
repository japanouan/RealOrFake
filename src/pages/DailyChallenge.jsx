import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DailyChallenge() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userReason, setUserReason] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock data for daily challenges
  const challenges = [
    {
      id: 1,
      title: "นักวิจัยพบสารใหม่ที่อาจรักษามะเร็งได้ 100%",
      content: "ทีมนักวิจัยจากมหาวิทยาลัยชื่อดังประกาศว่าพบสารประกอบใหม่ที่สามารถรักษามะเร็งได้ 100% ในการทดลองกับหนู โดยจะเริ่มทดสอบกับมนุษย์ในอีก 3 เดือนข้างหน้า",
      source: "HealthNews.com",
      domain: "health",
      publishDate: "2024-01-15",
      difficulty: "medium",
      correctAnswer: false,
      aiConfidence: 0.92,
      keyPoints: ["ใช้คำว่า '100%' ที่ไม่สมจริง", "ไม่มีข้อมูลอ้างอิงจากวารสาร", "เวลาในการทดสอบกับมนุษย์สั้นเกินไป"]
    },
    {
      id: 2,
      title: "รัฐบาลอนุมัติงบประมาณ 50,000 ล้านบาท สำหรับการศึกษา",
      content: "คณะรัฐมนตรีมีมติอนุมัติงบประมาณเพิ่มเติม 50,000 ล้านบาท สำหรับการพัฒนาระบบการศึกษาในปีงบประมาณ 2567 โดยจะเน้นการปรับปรุงโครงสร้างพื้นฐานและพัฒนาคุณภาพครู",
      source: "ข่าวรัฐบาลไทย",
      domain: "politics",
      publishDate: "2024-01-14",
      difficulty: "easy",
      correctAnswer: true,
      aiConfidence: 0.88,
      keyPoints: ["ข้อมูลชัดเจนและสมเหตุสมผล", "แหล่งข่าวน่าเชื่อถือ", "มีรายละเอียดเฉพาะเจาะจง"]
    }
  ];

  const currentChallenge = challenges[currentQuestion];
  const progress = ((currentQuestion + 1) / challenges.length) * 100;

  const handleSubmit = () => {
    if (selectedAnswer !== null && userReason.trim()) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < challenges.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setUserReason("");
      setShowFeedback(false);
    }
  };

  const handleFinish = () => {
    // Navigate to results or leaderboard
    alert("เสร็จสิ้นการทดสอบวันนี้! ไปดูผลลัพธ์ได้ที่หน้า Review");
  };

  if (showFeedback) {
    return (
      <main>
        <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
          {/* Progress */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: "500" }}>ข้อที่ {currentQuestion + 1} จาก {challenges.length}</span>
              <span style={{ color: "var(--gray-600)" }}>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="card">
            <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>📊 ผลการวิเคราะห์</h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem"
            }}>
              <div className="stat-card">
                <span className="stat-number" style={{ color: selectedAnswer === currentChallenge.correctAnswer ? "var(--success-color)" : "var(--error-color)" }}>
                  {selectedAnswer === currentChallenge.correctAnswer ? "✅" : "❌"}
                </span>
                <span className="stat-label">คำตอบของคุณ</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{Math.round(currentChallenge.aiConfidence * 100)}%</span>
                <span className="stat-label">ความมั่นใจ AI</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{currentChallenge.difficulty}</span>
                <span className="stat-label">ระดับความยาก</span>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>🔍 จุดสังเกตสำคัญ</h3>
              <div style={{
                background: "var(--gray-50)",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                borderLeft: "4px solid var(--primary-color)"
              }}>
                <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                  {currentChallenge.keyPoints.map((point, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem", color: "var(--gray-700)" }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>💭 เหตุผลของคุณ</h3>
              <div style={{
                background: "var(--gray-50)",
                padding: "1rem",
                borderRadius: "0.5rem",
                fontStyle: "italic",
                color: "var(--gray-700)"
              }}>
                "{userReason}"
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              {currentQuestion < challenges.length - 1 ? (
                <button onClick={handleNext} className="btn btn-primary">
                  ข้อถัดไป →
                </button>
              ) : (
                <button onClick={handleFinish} className="btn btn-success">
                  🏁 เสร็จสิ้นการทดสอบ
                </button>
              )}
              <Link to="/review" className="btn btn-secondary">
                📊 ดูประวัติ
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
            ⚡ Daily Challenge
          </h1>
          <p style={{ color: "var(--gray-600)" }}>
            ทดสอบทักษะการแยกข่าวจริง-ปลอมประจำวัน
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: "500" }}>ข้อที่ {currentQuestion + 1} จาก {challenges.length}</span>
            <span style={{ color: "var(--gray-600)" }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--gray-200)"
          }}>
            <div>
              <span className="badge" style={{
                background: "var(--primary-color)",
                color: "white",
                marginRight: "0.5rem"
              }}>
                {currentChallenge.domain}
              </span>
              <span className="badge badge-warning">{currentChallenge.difficulty}</span>
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
              {currentChallenge.publishDate}
            </div>
          </div>

          <h2 style={{ marginBottom: "1rem", color: "var(--gray-800)", lineHeight: "1.4" }}>
            {currentChallenge.title}
          </h2>
          
          <p style={{ 
            marginBottom: "1.5rem", 
            color: "var(--gray-700)", 
            lineHeight: "1.6",
            fontSize: "1.1rem"
          }}>
            {currentChallenge.content}
          </p>

          <div style={{
            background: "var(--gray-50)",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "2rem"
          }}>
            <p style={{ margin: "0", fontSize: "0.875rem", color: "var(--gray-600)" }}>
              <strong>แหล่งที่มา:</strong> {currentChallenge.source}
            </p>
          </div>

          {/* Answer Options */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
              คุณคิดว่าข่าวนี้เป็นข่าวจริงหรือปลอม?
            </h3>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <button
                onClick={() => setSelectedAnswer(true)}
                className={`btn ${selectedAnswer === true ? 'btn-success' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                ✅ ข่าวจริง
              </button>
              <button
                onClick={() => setSelectedAnswer(false)}
                className={`btn ${selectedAnswer === false ? 'btn-error' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                ❌ ข่าวปลอม
              </button>
            </div>
          </div>

          {/* Reason Input */}
          <div className="form-group">
            <label className="form-label">
              💭 เพราะอะไร? (เขียนเหตุผลของคุณ 1-2 บรรทัด)
            </label>
            <textarea
              className="form-input form-textarea"
              placeholder="เช่น ข้อมูลไม่สมเหตุสมผล, ไม่มีแหล่งอ้างอิง, ใช้คำพูดที่เกินจริง..."
              value={userReason}
              onChange={(e) => setUserReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={selectedAnswer === null || !userReason.trim()}
              style={{
                fontSize: "1.1rem",
                padding: "1rem 2rem",
                opacity: selectedAnswer === null || !userReason.trim() ? 0.5 : 1
              }}
            >
              🚀 ส่งคำตอบ
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="card" style={{ background: "var(--gray-50)" }}>
          <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>💡 เคล็ดลับการตรวจสอบข่าว</h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "var(--gray-700)" }}>
            <li>ตรวจสอบแหล่งที่มาและความน่าเชื่อถือ</li>
            <li>ดูวันที่เผยแพร่และความทันสมัยของข้อมูล</li>
            <li>สังเกตการใช้ภาษาและการนำเสนอ</li>
            <li>เปรียบเทียบกับแหล่งข่าวอื่น</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


