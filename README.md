RealOrFake 📰
🧐 คำอธิบายโปรเจกต์
RealOrFake คือเว็บแอปพลิเคชันที่สร้างขึ้นเพื่อเป็นเครื่องมือให้ผู้ใช้ฝึกฝนทักษะในการ แยกแยะข่าวจริง (Real) และข่าวปลอม (Fake) โดยการทำแบบทดสอบประจำวัน (Daily Challenges) ที่ออกแบบมาเพื่อจำลองกระบวนการตัดสินใจของโมเดล AI และให้ผู้ใช้ได้เรียนรู้เทคนิคการวิเคราะห์ข่าวอย่างมีประสิทธิภาพ

✨ คุณสมบัติหลัก
👤 บทบาทผู้ใช้ (User Role)
Daily Challenge: ทำแบบทดสอบประจำวันจากชุดข้อมูลข่าวที่ Admin นำเข้า
Interactive Clue Selection: ผู้ใช้เลือกคำหรือวลีในเนื้อหาข่าวที่คิดว่ามีน้ำหนักหรือส่งผลต่อการตัดสินใจว่าเป็นข่าวจริงหรือปลอม
Decision Making: เลือกว่าเนื้อหาข่าวนั้นเป็น "ข่าวจริง" หรือ "ข่าวปลอม"
Learning & Feedback: เรียนรู้เทคนิคการแยกแยะข่าว โดยระบบจะให้ข้อมูลย้อนกลับว่าคำที่เลือกนั้นมักจะปรากฏในข่าวจริงหรือข่าวปลอมส่วนใหญ่ (เช่น คำที่แสดงถึงความเร่งด่วนมักเป็นตัวบ่งชี้ข่าวปลอม)

🧑‍💻 บทบาทผู้ดูแลระบบ (Admin Role)
Data Import: นำเข้าชุดข้อมูลข่าวใหม่สำหรับ Daily Challenge โดยการอัปโหลดไฟล์ CSV
AI Processing: ข้อมูลข่าวที่นำเข้า (News Title, Text, Domain) จะถูกส่งผ่านโมเดล AI เพื่อ:
Labeling: ติดป้ายกำกับว่าเป็นข่าวจริง (Real) หรือข่าวปลอม (Fake)
Clueword Generation: สร้างรายการคำ (Cluewords) ที่ AI ใช้เป็นหลักในการตัดสินใจ

Frontend:	React (JavaScript Library)
Backend: API	FastAPI (Python Web Framework)
Database: Realtime Database(Firebase)

คำสั่งที่ต้องใช้
cd Backend
ติดตั้ง dependencies backend: pip install -r requirements.txt
ใช้เพื่อรันเซิฟ: uvicorn app.main:app --reload

กลับไปที่Root Directory
cd Fontend
ติดตั้ง dependencies frontend: npm install
ใช้เพื่อรันเซิฟ: npm run dev
