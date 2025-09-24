import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navItems = [
    { path: "/", label: "🏠 หน้าแรก", icon: "🏠" },
    { path: "/challenge", label: "⚡ ทดสอบ", icon: "⚡" },
    { path: "/review", label: "📊 ประวัติ", icon: "📊" },
    { path: "/leaderboard", label: "🏆 อันดับ", icon: "🏆" },
    { path: "/learn", label: "📚 เรียนรู้", icon: "📚" }
  ];

  // Add admin link if user is admin
  if (userRole === 'admin') {
    navItems.push({ path: "/admin", label: "⚙️ จัดการ", icon: "⚙️" });
  }

  return (
    <nav>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "2rem",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{ 
          fontSize: "1.5rem", 
          fontWeight: "bold", 
          color: "var(--primary-color)",
          marginRight: "auto"
        }}>
          🔍 Fake News Challenge
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
            >
              <span>{item.icon}</span>
              <span style={{ display: window.innerWidth > 768 ? "inline" : "none" }}>
                {item.label.split(" ")[1]}
              </span>
            </Link>
          ))}
          
          {/* User Menu */}
          {currentUser && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  background: "var(--gray-100)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                <span>👤</span>
                <span style={{ display: window.innerWidth > 768 ? "inline" : "none" }}>
                  {currentUser.displayName || "ผู้ใช้"}
                </span>
                {userRole === 'admin' && (
                  <span style={{ 
                    fontSize: "0.75rem", 
                    background: "var(--warning-color)", 
                    color: "white", 
                    padding: "0.125rem 0.5rem", 
                    borderRadius: "0.25rem" 
                  }}>
                    ADMIN
                  </span>
                )}
                <span style={{ fontSize: "0.75rem" }}>▼</span>
              </button>
              
              {showUserMenu && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "white",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "0.5rem",
                  boxShadow: "var(--shadow-lg)",
                  padding: "0.5rem",
                  minWidth: "200px",
                  zIndex: 1000
                }}>
                  <div style={{ padding: "0.5rem", borderBottom: "1px solid var(--gray-200)" }}>
                    <div style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                      {currentUser.displayName || "ผู้ใช้"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--gray-600)" }}>
                      {currentUser.email}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: "var(--error-color)",
                      borderRadius: "0.25rem",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "var(--gray-50)"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    🚪 ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


