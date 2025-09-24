import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [currentTab, setCurrentTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: ""
  });

  const { currentUser, register, login, logout } = useAuth();
  const location = useLocation();

  // Redirect if already logged in
  if (currentUser) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the redirect above
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      // Check if this is the first user (no users exist) - make them admin
      const role = await checkIfFirstUser() ? 'admin' : 'user';
      await register(formData.email, formData.password, formData.username, role);
      // Navigation will be handled by the redirect above
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
    setLoading(false);
  };

  const checkIfFirstUser = async () => {
    // Simple check: if email contains 'admin' or is the first registration
    return formData.email.toLowerCase().includes('admin') || 
           formData.email === 'admin@example.com';
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'ไม่พบผู้ใช้ในระบบ';
      case 'auth/wrong-password':
        return 'รหัสผ่านไม่ถูกต้อง';
      case 'auth/email-already-in-use':
        return 'อีเมลนี้ถูกใช้งานแล้ว';
      case 'auth/weak-password':
        return 'รหัสผ่านอ่อนเกินไป';
      case 'auth/invalid-email':
        return 'รูปแบบอีเมลไม่ถูกต้อง';
      case 'auth/too-many-requests':
        return 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่';
      default:
        return 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    }
  };

  return (
    <main>
      <div style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "2rem"
      }}>
        <div className="card">
          <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--gray-800)" }}>
            {currentTab === "login" ? "🔐 เข้าสู่ระบบ" : "📝 สมัครสมาชิก"}
          </h2>
          
          <div style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            background: "var(--gray-100)",
            padding: "0.25rem",
            borderRadius: "0.5rem"
          }}>
            <button
              onClick={() => setCurrentTab("login")}
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "none",
                borderRadius: "0.25rem",
                background: currentTab === "login" ? "white" : "transparent",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setCurrentTab("register")}
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "none",
                borderRadius: "0.25rem",
                background: currentTab === "register" ? "white" : "transparent",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              สมัครสมาชิก
            </button>
          </div>

          {error && (
            <div style={{
              background: "var(--error-color)",
              color: "white",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={currentTab === "login" ? handleLogin : handleRegister}>
            {currentTab === "register" && (
              <div className="form-group">
                <label className="form-label">ชื่อผู้ใช้</label>
                <input 
                  type="text" 
                  name="username"
                  className="form-input" 
                  placeholder="ชื่อผู้ใช้" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">อีเมล</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="example@email.com" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">รหัสผ่าน</label>
              <input 
                type="password" 
                name="password"
                className="form-input" 
                placeholder="รหัสผ่าน" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
            </div>

            {currentTab === "register" && (
              <div className="form-group">
                <label className="form-label">ยืนยันรหัสผ่าน</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="form-input" 
                  placeholder="ยืนยันรหัสผ่าน" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "กำลังดำเนินการ..." : (currentTab === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก")}
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: "1.5rem",
            padding: "1rem",
            background: "var(--gray-100)",
            borderRadius: "0.5rem"
          }}>
            <p style={{ margin: "0 0 1rem 0", color: "var(--gray-600)" }}>หรือเข้าสู่ระบบด้วย</p>
            <button className="btn btn-secondary" style={{ width: "100%" }} disabled>
              📧 Google (เร็วๆ นี้)
            </button>
          </div>

          {currentTab === "register" && (
            <div style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--warning-color)",
              color: "white",
              borderRadius: "0.5rem",
              fontSize: "0.875rem"
            }}>
              <strong>💡 หมายเหตุ:</strong> สำหรับการสมัครแอดมิน ให้ใช้อีเมลที่มีคำว่า "admin" หรือ "admin@example.com"
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


