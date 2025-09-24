import React, { useState } from "react";

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState("basics");

  const categories = [
    { id: "basics", name: "พื้นฐาน", icon: "📚" },
    { id: "techniques", name: "เทคนิค", icon: "🔍" },
    { id: "examples", name: "ตัวอย่าง", icon: "💡" },
    { id: "tools", name: "เครื่องมือ", icon: "🛠️" }
  ];

  const learningContent = {
    basics: [
      {
        title: "การตรวจสอบข่าว 5 ขั้นตอน",
        content: "เรียนรู้วิธีการตรวจสอบข่าวอย่างเป็นระบบ",
        points: [
          "ตรวจสอบแหล่งที่มา - ดูว่าแหล่งข่าวน่าเชื่อถือหรือไม่",
          "ดูวันที่เผยแพร่ - ข้อมูลใหม่หรือเก่า",
          "ตรวจสอบผู้เขียน - มีความเชี่ยวชาญหรือไม่",
          "เปรียบเทียบกับแหล่งอื่น - มีการรายงานเหมือนกันหรือไม่",
          "ใช้วิจารณญาณ - ข้อมูลสมเหตุสมผลหรือไม่"
        ],
        icon: "📋"
      },
      {
        title: "สัญญาณเตือนข่าวปลอม",
        content: "จุดสังเกตที่บ่งบอกว่าข่าวอาจเป็นข่าวปลอม",
        points: [
          "ใช้คำที่เกินจริง เช่น '100%', 'แน่นอน', 'ไม่มีทางผิด'",
          "ไม่มีแหล่งอ้างอิงหรือข้อมูลสนับสนุน",
          "วันที่เผยแพร่ไม่ชัดเจนหรือผิดปกติ",
          "ใช้รูปภาพที่ตัดต่อหรือไม่เกี่ยวข้อง",
          "มีข้อผิดพลาดทางไวยากรณ์หรือการสะกดมาก"
        ],
        icon: "⚠️"
      }
    ],
    techniques: [
      {
        title: "การตรวจสอบโดเมนเว็บไซต์",
        content: "วิธีการตรวจสอบความน่าเชื่อถือของเว็บไซต์",
        points: [
          "ดูนามสกุลโดเมน - .com, .org, .edu มีความน่าเชื่อถือต่างกัน",
          "ตรวจสอบประวัติเว็บไซต์ - ใช้ Wayback Machine",
          "ดูข้อมูล WHOIS - ใครเป็นเจ้าของเว็บไซต์",
          "ตรวจสอบ SSL Certificate - มีการเข้ารหัสหรือไม่",
          "อ่านหน้า About Us - ข้อมูลองค์กรชัดเจนหรือไม่"
        ],
        icon: "🌐"
      },
      {
        title: "การตรวจสอบรูปภาพ",
        content: "วิธีการตรวจสอบความแท้จริงของรูปภาพ",
        points: [
          "ใช้ Google Reverse Image Search",
          "ตรวจสอบ metadata ของรูปภาพ",
          "ดูรายละเอียดในรูป - สิ่งที่ไม่สมเหตุสมผล",
          "เปรียบเทียบกับรูปอื่นในเหตุการณ์เดียวกัน",
          "ใช้เครื่องมือตรวจจับการตัดต่อ"
        ],
        icon: "🖼️"
      }
    ],
    examples: [
      {
        title: "ตัวอย่างข่าวปลอมที่พบบ่อย",
        content: "รูปแบบข่าวปลอมที่มักพบในสังคมออนไลน์",
        points: [
          "ข่าวสุขภาพ - อาหารรักษาโรคได้ 100%",
          "ข่าวการเงิน - วิธีรวยเร็วใน 7 วัน",
          "ข่าวการเมือง - คำพูดของนักการเมืองที่ถูกบิดเบือน",
          "ข่าววิทยาศาสตร์ - การค้นพบที่เกินจริง",
          "ข่าวสังคม - เหตุการณ์ที่เกิดขึ้นในที่อื่น"
        ],
        icon: "📰"
      },
      {
        title: "เทคนิคการแยกแยะตัวเลข",
        content: "วิธีการตรวจสอบข้อมูลตัวเลขและสถิติ",
        points: [
          "ดูที่มาของข้อมูล - สำรวจจากหน่วยงานใด",
          "ตรวจสอบขนาดกลุ่มตัวอย่าง",
          "ดูช่วงเวลาในการเก็บข้อมูล",
          "เปรียบเทียบกับข้อมูลจากแหล่งอื่น",
          "สังเกตการนำเสนอ - กราฟบิดเบือนหรือไม่"
        ],
        icon: "📊"
      }
    ],
    tools: [
      {
        title: "เครื่องมือตรวจสอบข่าว",
        content: "เว็บไซต์และเครื่องมือที่ช่วยตรวจสอบข่าว",
        points: [
          "Snopes.com - ตรวจสอบข่าวลือและข่าวปลอม",
          "FactCheck.org - ตรวจสอบข้อความทางการเมือง",
          "Google Fact Check - ผลการตรวจสอบจากหลายแหล่ง",
          "TinEye - ค้นหารูปภาพที่ถูกใช้ซ้ำ",
          "Wayback Machine - ดูประวัติเว็บไซต์"
        ],
        icon: "🔧"
      },
      {
        title: "การตั้งค่า Browser",
        content: "วิธีการตั้งค่าเบราว์เซอร์เพื่อความปลอดภัย",
        points: [
          "เปิดใช้งาน popup blocker",
          "ตั้งค่าให้ตรวจสอบ SSL certificate",
          "ใช้ extension ตรวจสอบข่าวปลอม",
          "ปิดการติดตามจาก third-party",
          "อัพเดทเบราว์เซอร์เป็นประจำ"
        ],
        icon: "⚙️"
      }
    ]
  };

  const currentContent = learningContent[activeCategory] || [];

  return (
    <main>
      <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ marginBottom: "0.5rem", color: "var(--gray-800)" }}>
            📚 เรียนรู้เทคนิคการตรวจสอบข่าว
          </h1>
          <p style={{ color: "var(--gray-600)" }}>
            พัฒนาทักษะการคิดเชิงวิพากษ์และการแยกแยะข่าวจริง-ปลอม
          </p>
        </div>

        {/* Category Navigation */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "0.5rem",
                background: activeCategory === category.id ? "var(--primary-color)" : "var(--gray-100)",
                color: activeCategory === category.id ? "white" : "var(--gray-700)",
                cursor: "pointer",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Learning Content */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "2rem"
        }}>
          {currentContent.map((item, index) => (
            <div key={index} className="card">
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ fontSize: "2.5rem" }}>{item.icon}</div>
                <div>
                  <h2 style={{ margin: "0 0 0.25rem 0", color: "var(--gray-800)" }}>
                    {item.title}
                  </h2>
                  <p style={{ margin: "0", color: "var(--gray-600)", fontSize: "0.9rem" }}>
                    {item.content}
                  </p>
                </div>
              </div>

              <div style={{
                background: "var(--gray-50)",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                borderLeft: "4px solid var(--primary-color)"
              }}>
                <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                  {item.points.map((point, pointIndex) => (
                    <li key={pointIndex} style={{
                      marginBottom: "0.75rem",
                      color: "var(--gray-700)",
                      lineHeight: "1.5"
                    }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="card" style={{
          background: "linear-gradient(135deg, var(--success-color) 0%, #059669 100%)",
          color: "white",
          marginTop: "2rem"
        }}>
          <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
            💡 เคล็ดลับด่วน
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1rem",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏰</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>อย่ารีบร้อน</h3>
              <p style={{ margin: "0", fontSize: "0.875rem", opacity: 0.9 }}>
                ใช้เวลาในการตรวจสอบก่อนแชร์
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1rem",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>ตรวจสอบหลายแหล่ง</h3>
              <p style={{ margin: "0", fontSize: "0.875rem", opacity: 0.9 }}>
                เปรียบเทียบข้อมูลจากหลายแหล่ง
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              padding: "1rem",
              borderRadius: "0.5rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧠</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>ใช้วิจารณญาณ</h3>
              <p style={{ margin: "0", fontSize: "0.875rem", opacity: 0.9 }}>
                ข้อมูลสมเหตุสมผลหรือไม่
              </p>
            </div>
          </div>
        </div>

        {/* Practice CTA */}
        <div style={{
          textAlign: "center",
          padding: "2rem",
          background: "var(--gray-100)",
          borderRadius: "1rem",
          marginTop: "2rem"
        }}>
          <h2 style={{ marginBottom: "1rem", color: "var(--gray-800)" }}>
            🎯 พร้อมทดสอบความรู้แล้วหรือยัง?
          </h2>
          <p style={{ color: "var(--gray-600)", marginBottom: "1.5rem" }}>
            ลองใช้ความรู้ที่ได้เรียนรู้ในการทดสอบข่าวประจำวัน
          </p>
          <button className="btn btn-primary" style={{
            fontSize: "1.1rem",
            padding: "1rem 2rem"
          }}>
            ⚡ เริ่มทดสอบตอนนี้
          </button>
        </div>
      </div>
    </main>
  );
}


