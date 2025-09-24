import React, { useState } from "react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus("uploading");
      // Simulate upload process
      setTimeout(() => {
        setUploadStatus("success");
      }, 2000);
    }
  };

  const regenerateChallenge = () => {
    alert("กำลังสร้างโจทย์ใหม่สำหรับวันนี้...");
  };

  const stats = {
    totalUsers: 1234,
    todayActive: 156,
    averageAccuracy: 87,
    totalChallenges: 245
  };

  return (
    <main>
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
            ⚙️ Admin Backoffice
          </h1>
          <p style={{ color: "var(--gray-600)" }}>
            จัดการระบบและติดตามการใช้งาน
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
          {[
            { id: "upload", name: "อัพโหลด", icon: "📤" },
            { id: "settings", name: "ตั้งค่า", icon: "⚙️" },
            { id: "analytics", name: "สถิติ", icon: "📊" },
            { id: "users", name: "ผู้ใช้", icon: "👥" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "none",
                borderRadius: "0.25rem",
                background: activeTab === tab.id ? "white" : "transparent",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                📤 อัพโหลดชุดโจทย์ใหม่
              </h2>
              
              <div style={{
                border: "2px dashed var(--gray-300)",
                borderRadius: "0.5rem",
                padding: "2rem",
                textAlign: "center",
                marginBottom: "1.5rem"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📁</div>
                <h3 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
                  ลากไฟ CSV มาวางที่นี่
                </h3>
                <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
                  หรือคลิกเพื่อเลือกไฟล์
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="btn btn-primary"
                  style={{ cursor: "pointer" }}
                >
                  เลือกไฟล์ CSV
                </label>
              </div>

              {uploadStatus === "uploading" && (
                <div style={{
                  background: "var(--warning-color)",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  marginBottom: "1rem"
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
                  กำลังอัพโหลดและประมวลผลไฟล์...
                </div>
              )}

              {uploadStatus === "success" && (
                <div style={{
                  background: "var(--success-color)",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                  marginBottom: "1rem"
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✅</div>
                  อัพโหลดสำเร็จ! เพิ่มโจทย์ใหม่ 25 ข้อ
                </div>
              )}

              <div style={{
                background: "var(--gray-50)",
                padding: "1rem",
                borderRadius: "0.5rem"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--gray-800)" }}>
                  รูปแบบไฟล์ CSV ที่รองรับ:
                </h4>
                <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "var(--gray-700)" }}>
                  <li>title: หัวข้อข่าว</li>
                  <li>content: เนื้อหาข่าว</li>
                  <li>source: แหล่งข่าว</li>
                  <li>domain: หมวดหมู่ (health, politics, science, society)</li>
                  <li>difficulty: ระดับความยาก (easy, medium, hard)</li>
                  <li>label: คำตอบที่ถูกต้อง (true/false)</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                🎯 จัดการโจทย์ประจำวัน
              </h3>
              <div style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap"
              }}>
                <button onClick={regenerateChallenge} className="btn btn-primary">
                  🔄 สร้างโจทย์ใหม่วันนี้
                </button>
                <button className="btn btn-secondary">
                  📅 ตั้งค่าโจทย์ล่วงหน้า
                </button>
                <button className="btn btn-secondary">
                  🎲 เปลี่ยนการสุ่มโจทย์
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                ⚙️ ตั้งค่าระบบ
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem"
              }}>
                <div>
                  <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
                    🎯 การกระจายโจทย์
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="form-label">จำนวนโจทย์ต่อวัน</label>
                      <input type="number" className="form-input" defaultValue="5" min="1" max="10" />
                    </div>
                    <div>
                      <label className="form-label">สัดส่วนความยาก</label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input type="number" placeholder="ง่าย" defaultValue="40" style={{ flex: 1 }} className="form-input" />
                        <input type="number" placeholder="ปานกลาง" defaultValue="40" style={{ flex: 1 }} className="form-input" />
                        <input type="number" placeholder="ยาก" defaultValue="20" style={{ flex: 1 }} className="form-input" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
                    🤖 ตั้งค่า AI Model
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label className="form-label">Threshold ความมั่นใจ</label>
                      <input type="number" className="form-input" defaultValue="0.8" min="0" max="1" step="0.1" />
                    </div>
                    <div>
                      <label className="form-label">Model Version</label>
                      <select className="form-input">
                        <option value="v1.0">CNN + BiLSTM + Attention v1.0</option>
                        <option value="v1.1">CNN + BiLSTM + Attention v1.1</option>
                        <option value="v2.0">Transformer-based v2.0</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <button className="btn btn-primary">
                  💾 บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <div className="stats-grid" style={{ marginBottom: "2rem" }}>
              <div className="stat-card">
                <span className="stat-number">{stats.totalUsers}</span>
                <span className="stat-label">ผู้ใช้ทั้งหมด</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.todayActive}</span>
                <span className="stat-label">ผู้ใช้ที่ใช้งานวันนี้</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.averageAccuracy}%</span>
                <span className="stat-label">ความแม่นยำเฉลี่ย</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.totalChallenges}</span>
                <span className="stat-label">โจทย์ทั้งหมด</span>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                📊 สถิติการใช้งานรายวัน
              </h2>
              <div style={{
                background: "var(--gray-50)",
                padding: "2rem",
                borderRadius: "0.5rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</div>
                <p style={{ color: "var(--gray-600)" }}>
                  กราฟสถิติการใช้งานจะแสดงที่นี่
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-500)" }}>
                  (ต้องการเชื่อมต่อกับระบบ Analytics)
                </p>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                🎯 ประสิทธิภาพโมเดล
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem"
              }}>
                <div style={{
                  background: "var(--gray-50)",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--success-color)" }}>
                    89.2%
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
                    Accuracy
                  </div>
                </div>
                <div style={{
                  background: "var(--gray-50)",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>
                    0.3s
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
                    Response Time
                  </div>
                </div>
                <div style={{
                  background: "var(--gray-50)",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔄</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--warning-color)" }}>
                    99.8%
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--gray-600)" }}>
                    Uptime
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="card">
              <h2 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                👥 จัดการผู้ใช้
              </h2>
              
              <div style={{
                background: "var(--gray-50)",
                padding: "2rem",
                borderRadius: "0.5rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
                <p style={{ color: "var(--gray-600)", marginBottom: "1rem" }}>
                  รายการผู้ใช้และสถิติการใช้งาน
                </p>
                <button className="btn btn-primary">
                  📊 ดูรายงานผู้ใช้
                </button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1.5rem", color: "var(--gray-800)" }}>
                🔧 เครื่องมือจัดการ
              </h3>
              <div style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap"
              }}>
                <button className="btn btn-secondary">
                  📧 ส่งอีเมลแจ้งเตือน
                </button>
                <button className="btn btn-secondary">
                  🗑️ ลบข้อมูลเก่า
                </button>
                <button className="btn btn-secondary">
                  📤 Export ข้อมูล
                </button>
                <button className="btn btn-warning">
                  ⚠️ รีเซ็ตระบบ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


