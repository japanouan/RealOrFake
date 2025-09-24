import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function Auth() {
  const [currentTab, setCurrentTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: ""
  });

  const { currentUser, register, login } = useAuth();
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
      setError(getErrorMessage(error.message));
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
      // Grant admin only to the fixed credential
      const role = formData.email.toLowerCase() === 'admin888@gmail.com' ? 'admin' : 'user';
      await register(formData.email, formData.password, formData.username, role);
      // Navigation will be handled by the redirect above
    } catch (error) {
      setError(getErrorMessage(error.message));
    }
    setLoading(false);
  };

  const getErrorMessage = (errorMessage) => {
    switch (errorMessage) {
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
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {currentTab === "login" ? "ยินดีต้อนรับกลับ" : "สร้างบัญชีใหม่"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {currentTab === "login" 
              ? "เข้าสู่ระบบเพื่อเริ่มต้นการเรียนรู้" 
              : "สมัครสมาชิกเพื่อเข้าถึงฟีเจอร์ทั้งหมด"
            }
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-white rounded-2xl p-2 shadow-lg">
          <div className="flex">
            <button
              onClick={() => setCurrentTab("login")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                currentTab === "login"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setCurrentTab("register")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                currentTab === "register"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={currentTab === "login" ? handleLogin : handleRegister} className="space-y-6">
            {currentTab === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ใช้
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="ชื่อผู้ใช้"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="รหัสผ่าน"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {currentTab === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="ยืนยันรหัสผ่าน"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังดำเนินการ...
                </>
              ) : (
                currentTab === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"
              )}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">หรือเข้าสู่ระบบด้วย</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                disabled
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google (เร็วๆ นี้)
              </button>
            </div>
          </div>

          {/* Admin Note */}
          {currentTab === "register" && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-2" />
                <div className="text-sm">
                  <p className="text-orange-800 font-medium">💡 หมายเหตุ:</p>
                  <p className="text-orange-700">สำหรับการสมัครแอดมิน ให้ใช้อีเมลที่มีคำว่า "admin"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}