import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
        color: "white",
        padding: "4rem 2rem",
        borderRadius: "1rem",
        textAlign: "center",
        marginBottom: "3rem",
        boxShadow: "var(--shadow-xl)"
      }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          🔍 ฝึกแยกข่าวจริง–ปลอม
        </h1>
        <p style={{
          fontSize: "1.25rem",
          marginBottom: "2rem",
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto 2rem auto"
        }}>
          พัฒนาทักษะการคิดเชิงวิพากษ์ด้วยการทดสอบข่าวประจำวัน 
          พร้อมคำอธิบายและเทคนิคการตรวจสอบข่าว
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/challenge" className="btn btn-primary" style={{
            backgroundColor: "white",
            color: "var(--primary-color)",
            fontSize: "1.1rem",
            padding: "1rem 2rem"
          }}>
            ⚡ เริ่มทดสอบวันนี้
          </Link>
          <Link to="/learn" className="btn" style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "2px solid rgba(255,255,255,0.3)",
            fontSize: "1.1rem",
            padding: "1rem 2rem"
          }}>
            📚 เรียนรู้เทคนิค
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--gray-800)" }}>
          สถิติการใช้งาน
        </h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">1,234</span>
            <span className="stat-label">ผู้ใช้ทั้งหมด</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">5</span>
            <span className="stat-label">โจทย์วันนี้</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">89%</span>
            <span className="stat-label">ความแม่นยำเฉลี่ย</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">156</span>
            <span className="stat-label">ข้อทดสอบทั้งหมด</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--gray-800)" }}>
          ฟีเจอร์เด่น
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem"
        }}>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>AI วิเคราะห์ข่าว</h3>
            <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
              ใช้เทคโนโลยี CNN + BiLSTM + Attention เพื่อวิเคราะห์และให้คะแนนความน่าเชื่อถือของข่าว
            </p>
          </div>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>ติดตามความคืบหน้า</h3>
            <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
              ดูสถิติการทดสอบ ประวัติความแม่นยำ และพัฒนาการของคุณ
            </p>
          </div>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>ระบบรางวัล</h3>
            <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
              รับ badge และ streak เมื่อทำได้ดี พร้อมจัดอันดับกับเพื่อน
            </p>
          </div>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💡</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>คำอธิบายละเอียด</h3>
            <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
              เรียนรู้จุดสังเกตและเทคนิคการตรวจสอบข่าวจากแต่ละข้อทดสอบ
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        textAlign: "center",
        padding: "3rem 2rem",
        background: "var(--gray-100)",
        borderRadius: "1rem",
        marginTop: "3rem"
      }}>
        <h2 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
          พร้อมเริ่มต้นแล้วหรือยัง?
        </h2>
        <p style={{ color: "var(--gray-600)", marginBottom: "2rem" }}>
          เข้าร่วมการทดสอบประจำวันและพัฒนาทักษะการคิดเชิงวิพากษ์ของคุณ
        </p>
        <Link to="/challenge" className="btn btn-primary" style={{
          fontSize: "1.2rem",
          padding: "1rem 2rem"
        }}>
          🚀 เริ่มทดสอบตอนนี้
        </Link>
      </section>
    </main>
  );
}


