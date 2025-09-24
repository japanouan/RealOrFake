import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, User, LogOut, ChevronDown } from "lucide-react";

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
    { path: "/", label: "หน้าแรก", icon: "🏠" },
    { path: "/challenge", label: "ทดสอบ", icon: "⚡" },
    { path: "/review", label: "ประวัติ", icon: "📊" },
    { path: "/leaderboard", label: "อันดับ", icon: "🏆" },
    { path: "/learn", label: "เรียนรู้", icon: "📚" }
  ];

  // Add admin link if user is admin
  if (userRole === 'admin') {
    navItems.push({ path: "/admin", label: "จัดการ", icon: "⚙️" });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TruthCheck</h1>
              <p className="text-sm text-gray-600">ฝึกแยกข่าวจริง-ปลอม</p>
            </div>
          </Link>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {currentUser.displayName || "ผู้ใช้"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {currentUser.displayName || "ผู้ใช้"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {currentUser.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Role: {userRole || 'unknown'}
                      </div>
                      {userRole === 'admin' && (
                        <div className="inline-flex items-center px-2 py-1 mt-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          ADMIN
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-4">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}