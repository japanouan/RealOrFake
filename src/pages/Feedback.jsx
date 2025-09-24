import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Feedback() {
  const [selectedExample, setSelectedExample] = useState(0);

  // Mock feedback data
  const feedbackExamples = [
    {
      id: 1,
      title: "นักวิจัยพบสารใหม่ที่อาจรักษามะเร็งได้ 100%",
      userAnswer: false,
      correctAnswer: false,
      aiConfidence: 92,
      userReason: "ใช้คำว่า 100% ที่ไม่สมจริง และไม่มีข้อมูลอ้างอิง",
      result: "correct",
      aiAnalysis: {
        prediction: false,
        confidence: 0.92,
        keyWords: ["100%", "อาจ", "มหาวิทยาลัยชื่อดัง", "3 เดือน"],
        attentionScores: [
          { word: "100%", score: 0.95, reason: "คำที่เกินจริง" },
          { word: "อาจ", score: 0.78, reason: "ความไม่แน่นอน" },
          { word: "ชื่อดัง", score: 0.65, reason: "ไม่ระบุชัดเจน" }
        ],
        explanation: "ข่าวนี้มีลักษณะของข่าวปลอมที่ชัดเจน โดยใช้คำที่เกินจริงและไม่มีแหล่งอ้างอิงที่น่าเชื่อถือ"
      },
      tips: [
        "ข่าวสุขภาพที่อ้างว่าสามารถรักษาโรคได้ 100% มักเป็นข่าวปลอม",
        "ตรวจสอบแหล่งอ้างอิงจากวารสารวิทยาศาสตร์",
        "ดูวันที่เผยแพร่และความทันสมัยของข้อมูล"
      ],
      factCheckLinks: [
        { title: "Snopes - Medical Claims", url: "#" },
        { title: "WHO - Health Information", url: "#" }
      ]
    },
    {
      id: 2,
      title: "รัฐบาลอนุมัติงบประมาณ 50,000 ล้านบาท สำหรับการศึกษา",
      userAnswer: true,
      correctAnswer: true,
      aiConfidence: 88,
      userReason: "ข้อมูลชัดเจน มีแหล่งข่าวน่าเชื่อถือ",
      result: "correct",
      aiAnalysis: {
        prediction: true,
        confidence: 0.88,
        keyWords: ["รัฐบาล", "งบประมาณ", "การศึกษา", "คณะรัฐมนตรี"],
        attentionScores: [
          { word: "คณะรัฐมนตรี", score: 0.92, reason: "แหล่งข้อมูลน่าเชื่อถือ" },
          { word: "งบประมาณ", score: 0.85, reason: "ข้อมูลเฉพาะเจาะจง" },
          { word: "ปีงบประมาณ 2567", score: 0.78, reason: "ช่วงเวลาชัดเจน" }
        ],
        explanation: "ข่าวนี้มีลักษณะของข่าวจริง โดยมีแหล่งข้อมูลน่าเชื่อถือและรายละเอียดชัดเจน"
      },
      tips: [
        "ข่าวการเมืองจากแหล่งข่าวหลักมักมีความน่าเชื่อถือสูง",
        "ตรวจสอบข้อมูลงบประมาณจากเว็บไซต์รัฐบาล",
        "ดูการรายงานจากหลายแหล่งข่าว"
      ],
      factCheckLinks: [
        { title: "ข่าวรัฐบาลไทย", url: "#" },
        { title: "สำนักงบประมาณ", url: "#" }
      ]
    }
  ];

  const currentExample = feedbackExamples[selectedExample];

  return (
    <main>
      <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
            📊 ผลการวิเคราะห์และคำอธิบาย
          </h1>
          <p style={{ color: "var(--gray-600)" }}>
            เรียนรู้จากผลการวิเคราะห์ของ AI และจุดสังเกตสำคัญ
          </p>
        </div>

        {/* Example Selector */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
            🔍 เลือกตัวอย่างการวิเคราะห์
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {feedbackExamples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(index)}
                className={`btn ${selectedExample === index ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: "0.875rem" }}
              >
                ตัวอย่าง {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feedback Card */}
        <div className="card">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--gray-200)"
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: "0 0 0.5rem 0", color: "var(--gray-800)", lineHeight: "1.4" }}>
                {currentExample.title}
              </h2>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className={`badge ${currentExample.result === "correct" ? "badge-success" : "badge-error"}`}>
                  {currentExample.result === "correct" ? "ตอบถูก" : "ตอบผิด"}
                </span>
                <span className="badge badge-warning">
                  ความมั่นใจ {currentExample.aiConfidence}%
                </span>
              </div>
            </div>
            <div style={{ fontSize: "3rem" }}>
              {currentExample.result === "correct" ? "✅" : "❌"}
            </div>
          </div>

          {/* AI Analysis Results */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
              🤖 ผลการวิเคราะห์ AI
            </h3>
            <div style={{
              background: "var(--gray-50)",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              borderLeft: "4px solid var(--primary-color)"
            }}>
              <div style={{ marginBottom: "1rem" }}>
                <strong>การคาดการณ์:</strong> 
                <span style={{ 
                  color: currentExample.aiAnalysis.prediction ? "var(--success-color)" : "var(--error-color)",
                  marginLeft: "0.5rem"
                }}>
                  {currentExample.aiAnalysis.prediction ? "ข่าวจริง" : "ข่าวปลอม"}
                </span>
                <span style={{ marginLeft: "1rem", color: "var(--gray-600)" }}>
                  (ความมั่นใจ: {Math.round(currentExample.aiAnalysis.confidence * 100)}%)
                </span>
              </div>
              <div>
                <strong>คำอธิบาย:</strong> {currentExample.aiAnalysis.explanation}
              </div>
            </div>
          </div>

          {/* Attention Scores */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
              🔍 จุดสังเกตสำคัญ (Attention Analysis)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {currentExample.aiAnalysis.attentionScores.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: "var(--gray-50)",
                    borderRadius: "0.5rem"
                  }}
                >
                  <div style={{
                    background: `rgba(59, 130, 246, ${item.score})`,
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: "bold",
                    minWidth: "4rem",
                    textAlign: "center"
                  }}>
                    "{item.word}"
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
                      น้ำหนัก: {Math.round(item.score * 100)}%
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
                      {item.reason}
                    </div>
                  </div>
                  <div style={{
                    width: "60px",
                    height: "8px",
                    background: "var(--gray-200)",
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${item.score * 100}%`,
                      height: "100%",
                      background: "var(--primary-color)",
                      transition: "width 0.3s ease"
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User's Reasoning */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
              💭 เหตุผลที่คุณให้
            </h3>
            <div style={{
              background: "var(--gray-50)",
              padding: "1rem",
              borderRadius: "0.5rem",
              fontStyle: "italic",
              color: "var(--gray-700)"
            }}>
              "{currentExample.userReason}"
            </div>
          </div>

          {/* Tips */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
              💡 เคล็ดลับสำหรับกรณีนี้
            </h3>
            <div style={{
              background: "linear-gradient(135deg, var(--success-color) 0%, #059669 100%)",
              color: "white",
              padding: "1.5rem",
              borderRadius: "0.5rem"
            }}>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                {currentExample.tips.map((tip, index) => (
                  <li key={index} style={{ marginBottom: "0.5rem" }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fact Check Links */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
              🔗 แหล่งตรวจสอบข้อมูล
            </h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {currentExample.factCheckLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="btn btn-secondary"
                  style={{ fontSize: "0.875rem" }}
                >
                  🔍 {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            paddingTop: "1rem",
            borderTop: "1px solid var(--gray-200)"
          }}>
            <Link to="/challenge" className="btn btn-primary">
              ⚡ ทดสอบอีกครั้ง
            </Link>
            <Link to="/learn" className="btn btn-secondary">
              📚 เรียนรู้เทคนิค
            </Link>
            <Link to="/review" className="btn btn-secondary">
              📊 ดูประวัติ
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid" style={{ marginTop: "2rem" }}>
          <div className="stat-card">
            <span className="stat-number">89%</span>
            <span className="stat-label">ความแม่นยำ AI</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">0.3s</span>
            <span className="stat-label">เวลาวิเคราะห์</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">156</span>
            <span className="stat-label">ข้อวิเคราะห์วันนี้</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">12</span>
            <span className="stat-label">คำสำคัญเฉลี่ย</span>
          </div>
        </div>
      </div>
    </main>
  );
}


