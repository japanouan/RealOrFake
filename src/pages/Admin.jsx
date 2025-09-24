import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  Settings, 
  Users, 
  BarChart3, 
  Upload, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  TrendingUp,
  Target,
  Award,
  Shield,
  AlertTriangle
} from "lucide-react";

export default function Admin() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "จัดการผู้ใช้", icon: Users },
    { id: "content", label: "จัดการเนื้อหา", icon: Upload },
    { id: "analytics", label: "วิเคราะห์ข้อมูล", icon: TrendingUp },
    { id: "settings", label: "ตั้งค่า", icon: Settings }
  ];

  // Mock data
  const dashboardStats = {
    totalUsers: 15247,
    activeUsers: 8934,
    challengesCompleted: 45678,
    accuracyRate: 78.5,
    newUsersToday: 234,
    challengesToday: 1873
  };

  const recentUsers = [
    { id: 1, name: "TruthSeeker", email: "truth@example.com", joinDate: "2025-01-21", status: "active", role: "user" },
    { id: 2, name: "FactChecker", email: "fact@example.com", joinDate: "2025-01-20", status: "active", role: "user" },
    { id: 3, name: "NewsGuard", email: "news@example.com", joinDate: "2025-01-19", status: "inactive", role: "user" },
    { id: 4, name: "VerifyMaster", email: "verify@example.com", joinDate: "2025-01-18", status: "active", role: "user" }
  ];

  const challenges = [
    { id: 1, title: "ข่าวการเมือง", domain: "politics", difficulty: "medium", status: "active", createdDate: "2025-01-21" },
    { id: 2, title: "ข่าวสุขภาพ", domain: "health", difficulty: "easy", status: "active", createdDate: "2025-01-20" },
    { id: 3, title: "ข่าวเทคโนโลยี", domain: "technology", difficulty: "hard", status: "draft", createdDate: "2025-01-19" }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-lg text-gray-600">ภาพรวมการใช้งานระบบ TruthCheck</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ผู้ใช้ทั้งหมด</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardStats.newUsersToday} วันนี้</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ผู้ใช้ที่ใช้งาน</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{width: `${(dashboardStats.activeUsers / dashboardStats.totalUsers) * 100}%`}}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ข้อสอบที่ทำแล้ว</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.challengesCompleted.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{dashboardStats.challengesToday} วันนี้</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">กิจกรรมล่าสุด</h3>
        <div className="space-y-4">
          {[
            { action: "ผู้ใช้ใหม่", user: "TruthSeeker", time: "5 นาทีที่แล้ว", type: "success" },
            { action: "ทำข้อสอบเสร็จ", user: "FactChecker", time: "10 นาทีที่แล้ว", type: "info" },
            { action: "รายงานปัญหา", user: "NewsGuard", time: "15 นาทีที่แล้ว", type: "warning" },
            { action: "ผู้ใช้ใหม่", user: "VerifyMaster", time: "20 นาทีที่แล้ว", type: "success" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">โดย {activity.user}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้</h2>
          <p className="text-lg text-gray-600">ดูและจัดการผู้ใช้ในระบบ</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>เพิ่มผู้ใช้</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">ผู้ใช้</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">อีเมล</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">วันที่สมัคร</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">สถานะ</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">บทบาท</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">จัดการเนื้อหา</h2>
          <p className="text-lg text-gray-600">เพิ่มและจัดการข้อสอบ Daily Challenge</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>อัปโหลดข้อสอบ</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                challenge.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {challenge.status === 'active' ? 'ใช้งาน' : 'ร่าง'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">หมวดหมู่:</span>
                <span className="text-sm font-medium text-gray-900">{challenge.domain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ระดับความยาก:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">วันที่สร้าง:</span>
                <span className="text-sm font-medium text-gray-900">{challenge.createdDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>ดู</span>
              </button>
              <button className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>แก้ไข</span>
              </button>
              <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">วิเคราะห์ข้อมูล</h2>
        <p className="text-lg text-gray-600">สถิติและแนวโน้มการใช้งานระบบ</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">กราฟการใช้งาน</h3>
        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">กราฟจะแสดงที่นี่</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ตั้งค่าระบบ</h2>
        <p className="text-lg text-gray-600">การตั้งค่าทั่วไปของระบบ</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">การตั้งค่าข้อสอบ</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนข้อสอบต่อวัน</label>
              <input type="number" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" defaultValue="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">เวลาที่กำหนด</label>
              <input type="time" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">การแจ้งเตือน</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-gray-700">ส่งอีเมลแจ้งเตือน Daily Challenge</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">แจ้งเตือนเมื่อมีผู้ใช้ใหม่</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-gray-700">รายงานสถิติประจำสัปดาห์</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-lg text-gray-600">ยินดีต้อนรับ {currentUser?.displayName || 'Admin'}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-medium">
              ADMIN
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "content" && renderContent()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </div>
    </div>
  );
}