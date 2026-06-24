import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { resetUserRole } from "../utils/resetUserRole";
import { db, auth } from "../firebase";
import { onValue, ref, set, get } from "firebase/database";
import { signInWithCustomToken } from "firebase/auth";
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

const API_BASE_URL = import.meta.env.VITE_FIREBASE_API_BASE_URL;

export default function Admin() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "จัดการผู้ใช้", icon: Users },
    { id: "content", label: "จัดการเนื้อหา", icon: Upload }
  ];

  // Subscribe to realtime users
  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const value = snapshot.val() || {};
      // Expect either map keyed by uid or array
      const list = Array.isArray(value)
        ? value.filter(Boolean)
        : Object.keys(value).map((key) => ({ id: key, uid: key, ...value[key] }));
      setUsers(list.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }));
      setLoadingUsers(false);
    }, () => setLoadingUsers(false));
    return () => unsubscribe();
  }, []);

  // Compute dashboard stats from realtime users
  const dashboardStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status?.state === "active" || u.status === "active" || u.active === true).length;
    // Placeholder fields derived from user stats if exist
    const challengesCompleted = users.reduce((sum, u) => sum + (u.stats?.totalQuestions || 0), 0);
    const correct = users.reduce((sum, u) => sum + (u.stats?.correctAnswers || 0), 0);
    const accuracyRate = challengesCompleted > 0 ? (correct / challengesCompleted) * 100 : 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    const newUsersToday = users.filter(u => {
      if (!u.createdAt) return false;
      const t = new Date(u.createdAt);
      return t >= today;
    }).length;
    const challengesToday = users.reduce((sum, u) => sum + (u.stats?.todayQuestions || 0), 0);
    return { totalUsers, activeUsers, challengesCompleted, accuracyRate, newUsersToday, challengesToday };
  }, [users]);

  // Safe placeholder for content list to prevent runtime errors
  const challenges = useMemo(() => [], []);

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString();
    } catch {
      return String(value);
    }
  };

  // Function to clear all items from Firebase
  const clearAllItems = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมดในตาราง items? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
      return;
    }

    try {
      const itemsRef = ref(db, 'items');
      await set(itemsRef, null); // Set to null to delete all data
      alert('ลบข้อมูลทั้งหมดเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error clearing items:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + error.message);
    }
  };

  // Function to create items table structure
  const createItemsTable = async () => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะสร้างตาราง items? หากมีข้อมูลอยู่แล้วจะถูกแทนที่!')) {
      return;
    }

    try {
      const itemsRef = ref(db, 'items');
      
      // สร้างโครงสร้างตาราง items พร้อมข้อมูลตัวอย่าง
      const sampleData = {
        "item001": {
          "title": "ตัวอย่างข่าวที่ 1",
          "text": "นี่คือตัวอย่างข่าวสำหรับทดสอบระบบ",
          "domain": "ไม่ระบุแหล่งที่มา",
          "label": 0,
          "clueWords": ["ตัวอย่าง", "ข่าว", "ทดสอบ"],
          "clue_words_analysis": [
            {
              "word": "ตัวอย่าง",
              "analysis": "คำ 'ตัวอย่าง' เป็นคำสำคัญที่โมเดล AI ใช้ในการวิเคราะห์ว่าข่าวนี้เป็นข่าวปลอม",
              "found_in_reason": false
            }
          ],
          "confidence": 0.5,
          "processedAt": Date.now(),
          "source": null,
          "publishedAt": null,
          "topic": null,
          "createdAt": Date.now()
        },
        "item002": {
          "title": "ตัวอย่างข่าวที่ 2",
          "text": "นี่คือตัวอย่างข่าวที่สองสำหรับทดสอบระบบ",
          "domain": "ไม่ระบุแหล่งที่มา",
          "label": 1,
          "clueWords": ["ตัวอย่าง", "ข่าว", "สอง"],
          "clue_words_analysis": [
            {
              "word": "ตัวอย่าง",
              "analysis": "คำ 'ตัวอย่าง' เป็นคำสำคัญที่โมเดล AI ใช้ในการวิเคราะห์ว่าข่าวนี้เป็นข่าวจริง",
              "found_in_reason": false
            }
          ],
          "confidence": 0.7,
          "processedAt": Date.now(),
          "source": null,
          "publishedAt": null,
          "topic": null,
          "createdAt": Date.now()
        }
      };

      await set(itemsRef, sampleData);
      alert('สร้างตาราง items พร้อมข้อมูลตัวอย่างเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error creating items table:', error);
      alert('เกิดข้อผิดพลาดในการสร้างตาราง: ' + error.message);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-lg text-gray-600">ภาพรวมการใช้งานระบบ RealOrFake</p>
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
          {users.slice(0, 4).map((u, index) => {
            const created = u.createdAt ? new Date(u.createdAt) : null;
            const time = created ? created.toLocaleString() : "-";
            return (
              <div key={u.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">ผู้ใช้ใหม่</p>
                  <p className="text-sm text-gray-600">โดย {u.username || u.name || u.email || u.uid}</p>
                </div>
                <span className="text-sm text-gray-500">{time}</span>
              </div>
            );
          })}
          {users.length === 0 && (
            <div className="text-sm text-gray-500">ไม่พบข้อมูลผู้ใช้</div>
          )}
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
              {(loadingUsers ? [] : users).map((user, idx) => (
                <tr key={user.id || user.uid || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {(user.username || user.name || user.email || "U").toString().charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{user.username || user.name || user.email || user.uid}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status?.state === 'active' || user.status === 'active' || user.active === true
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status?.state === 'active' || user.status === 'active' || user.active === true ? 'Active' : 'Unactive'}
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
              {!loadingUsers && users.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-500">ไม่พบผู้ใช้</td>
                </tr>
              )}
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
        <div className="flex space-x-3">
          <button 
            onClick={createItemsTable}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>สร้างตาราง items</span>
          </button>
          <button 
            onClick={clearAllItems}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-5 w-5" />
            <span>ลบข้อมูลทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Upload Items to RTDB */}
      <UploadItemsCard />

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

 

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-lg text-gray-600">ยินดีต้อนรับ {currentUser?.displayName || 'Admin'}</p>
            <p className="text-sm text-gray-500">Email: {currentUser?.email}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={resetUserRole}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Reset Role
            </button>
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
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
  activeTab === tab.id
    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
    : "text-gray-700 hover:text-blue-600"
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

// ---- Components ----
function UploadItemsCard() {
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState({ inserted: 0, errors: [] });
  const [xlsxModule, setXlsxModule] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function parseCSVLike(text, delimiter) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headers = lines[0].split(delimiter).map(h => h.trim());
    return lines.slice(1).map((line) => {
      const cols = line.split(delimiter);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (cols[i] ?? '').trim(); });
      return obj;
    });
  }

  function validateItemShape(item) {
    // Required fields for items in RTDB - only title and text
    const required = ['title', 'text'];
    const missing = required.filter(k => !item || item[k] === undefined || item[k] === null || String(item[k]).trim() === '');
    if (missing.length > 0) {
      return { ok: false, message: `ข้อมูลไม่ครบ: ขาด ${missing.join(', ')}` };
    }
    // Basic normalization - AI will add label and clueWords later
    const normalized = {
      title: String(item.title),
      text: String(item.text),
      domain: item.domain || 'ไม่ระบุแหล่งที่มา',
      label: 0, // Default to 0, will be updated by AI
      // Optional fields that rules allow
      source: null,
      publishedAt: null,
      topic: null,
      createdAt: Date.now()
    };
    return { ok: true, value: normalized };
  }

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setParsing(true);
    const file = files[0];
    const name = (file.name || '').toLowerCase();
    const errors = [];
    let rows = [];

    try {
      if (name.endsWith('.json')) {
        const text = await readFileAsText(file);
        const data = JSON.parse(text);
        
        // Handle different JSON structures
        if (Array.isArray(data)) {
          rows = data;
        } else if (Array.isArray(data.items)) {
          rows = data.items;
        } else if (data.items && typeof data.items === 'object') {
          // Handle nested object structure like {items: {key1: {...}, key2: {...}}}
          rows = Object.values(data.items);
        } else {
          rows = [];
        }
      } else if (name.endsWith('.csv')) {
        const text = await readFileAsText(file);
        rows = parseCSVLike(text, ',');
      } else if (name.endsWith('.tsv')) {
        const text = await readFileAsText(file);
        rows = parseCSVLike(text, '\t');
  } else if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
        const XLSX = xlsxModule || (await import('xlsx'));
        if (!xlsxModule) setXlsxModule(XLSX);
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      } else {
        throw new Error('ชนิดไฟล์ไม่รองรับ (รองรับ .json .csv .tsv .xls(x)*)');
      }
    } catch (e) {
      setResult({ inserted: 0, errors: [String(e.message || e)] });
      setParsing(false);
      return;
    }

    // Only validate and stage rows; do not push yet
    const staged = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const v = validateItemShape(row);
      if (!v.ok) {
        errors.push(`แถวที่ ${i + 1}: ${v.message}`);
        continue;
      }
      staged.push(v.value);
    }

    setParsedRows(staged);
    setResult({ inserted: 0, errors });
    setParsing(false);
  }

  // Function to authenticate as admin for database operations
  async function authenticateAsAdmin() {
    try {
      // Try to get admin token from backend
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: currentUser?.email || 'admin@example.com'
        })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        await signInWithCustomToken(auth, token);
        return true;
      }
    } catch (error) {
      console.warn('Admin authentication failed:', error);
    }
    return false;
  }

  // Function to call AI API for processing
  async function processWithAI(title, text) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          text: text,
          processOnly: true,
          userId: 'admin_processing'
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('AI API Response:', result);
      
      // Extract clueWords from the response - ensure it's always an array
      let clueWords = [];
      if (result.clueWords && Array.isArray(result.clueWords)) {
        clueWords = result.clueWords.filter(word => word && word.trim() !== '');
      } else if (result.clue_words_analysis && Array.isArray(result.clue_words_analysis)) {
        clueWords = result.clue_words_analysis
          .map(item => item.word || item)
          .filter(word => word && word.trim() !== '');
      }
      
      // Ensure clue_words_analysis is always an array
      let clue_words_analysis = [];
      if (result.clue_words_analysis && Array.isArray(result.clue_words_analysis)) {
        clue_words_analysis = result.clue_words_analysis;
      }
      
      return {
        label: result.label || 0,
        clueWords: clueWords,
        confidence: result.confidence || 0.5,
        clue_words_analysis: result.clue_words_analysis || [],
        ai_reasoning: result.ai_reasoning || ""
      };
    } catch (error) {
      console.warn('AI processing failed:', error);
      // Return default values if AI fails
      return {
        label: 0,
        clueWords: [],
        confidence: 0.5,
        clue_words_analysis: [],
        ai_reasoning: ""
      };
    }
  }

  async function pushToDatabase() {
    if (parsing || parsedRows.length === 0) return;
    setParsing(true);
    const errors = [];
    let inserted = 0;

    // Try to authenticate as admin first
    const isAdmin = await authenticateAsAdmin();
    if (!isAdmin) {
      console.warn('Admin authentication failed, trying with current user...');
      // Continue with current user - might work if rules allow
    }

    try {
      const itemsRef = ref(db, 'items');
      const snapshot = await get(itemsRef);
      const existing = snapshot.exists() ? snapshot.val() : {};

      const existingKeys = Object.keys(existing || {});
      const numberMatches = existingKeys
        .map((k) => {
          const m = /^item(\d+)$/.exec(k);
          return m ? Number(m[1]) : null;
        })
        .filter((n) => n !== null);

      const maxNumber = numberMatches.length > 0 ? Math.max(...numberMatches) : 0;

      // Determine padding from existing keys (default to 3 digits)
      const padLength = (() => {
        const lengths = existingKeys
          .map((k) => {
            const m = /^item(\d+)$/.exec(k);
            return m ? m[1].length : null;
          })
          .filter((v) => v !== null);
        return lengths.length > 0 ? Math.max(...lengths) : 3;
      })();

      for (let i = 0; i < parsedRows.length; i++) {
        try {
          const item = parsedRows[i];
          console.log(`Processing item ${i + 1}/${parsedRows.length}: ${item.title}`);
          
          // Call AI API to process the item
          const aiResult = await processWithAI(item.title, item.text);
          
          // Create final item with AI results
          const finalItem = {
            ...item,
            label: aiResult.label,
            // Store clueWords as Array in Firebase - ensure it's always an array
            clueWords: Array.isArray(aiResult.clueWords) ? aiResult.clueWords : [],
            confidence: aiResult.confidence,
            processedAt: Date.now(),
            // Store full clue_words_analysis from AI - ensure it's always an array
            clue_words_analysis: Array.isArray(aiResult.clue_words_analysis) ? aiResult.clue_words_analysis : [],
            // Store AI reasoning explanation
            ai_reasoning: aiResult.ai_reasoning || ""
          };

          const nextNumber = maxNumber + 1 + i;
          const key = `item${String(nextNumber).padStart(padLength, '0')}`;
          await set(ref(db, `items/${key}`), finalItem);
          inserted += 1;
          
          console.log(`Item ${i + 1} processed:`, {
            title: item.title,
            label: aiResult.label,
            clueWords: aiResult.clueWords,
            clueWordsCount: aiResult.clueWords.length,
            clue_words_analysis: aiResult.clue_words_analysis,
            confidence: aiResult.confidence,
            ai_reasoning: aiResult.ai_reasoning
          });
        } catch (e) {
          const errorMsg = String(e.message || e);
          if (errorMsg.includes('PERMISSION_DENIED')) {
            errors.push(`แถวที่ ${i + 1}: ไม่มีสิทธิ์เข้าถึงฐานข้อมูล - กรุณาตรวจสอบสิทธิ์ Admin`);
          } else {
            errors.push(`ประมวลผลแถวที่ ${i + 1} ล้มเหลว: ${errorMsg}`);
          }
        }
      }
    } catch (e) {
      errors.push(String(e.message || e));
    }

    setResult({ inserted, errors });
    setParsing(false);
    if (inserted > 0) setParsedRows([]);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">อัปโหลดรายการ Items พร้อม AI Processing</h3>
      <p className="text-sm text-gray-600 mb-4">
        รองรับไฟล์ .json, .csv, .tsv, .xls, .xlsx (ต้องมีคอลัมน์ title และ text เท่านั้น)<br/>
        ระบบจะใช้ AI ประมวลผลเพื่อสร้าง label (0/1) และ clueWords อัตโนมัติ
      </p>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".json,.csv,.tsv,.xls,.xlsx"
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={parsing}
        />
        <button
          type="button"
          onClick={pushToDatabase}
          disabled={parsing || parsedRows.length === 0}
          className={`px-4 py-2 rounded-md font-medium ${
            parsedRows.length === 0 || parsing
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {parsing ? 'กำลังประมวลผลด้วย AI...' : 'อัปโหลดและประมวลผลด้วย AI'}
        </button>
        {parsing && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">กำลังประมวลผลด้วย AI...</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-700">
          เตรียมอัปโหลด: <span className="font-medium">{parsedRows.length}</span> รายการ | 
          เพิ่มสำเร็จ: <span className="font-medium text-green-700">{result.inserted}</span> |
          AI จะกำหนด clueWords สำหรับแต่ละรายการ
        </div>
        {result.errors.length > 0 && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 space-y-1">
            <div className="font-medium">พบข้อผิดพลาด {result.errors.length} รายการ</div>
            <ul className="list-disc pl-5 text-sm">
              {result.errors.slice(0, 10).map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
            {result.errors.length > 10 && (
              <div className="text-xs text-red-600">แสดงเพียง 10 ข้อแรก</div>
            )}
            {result.errors.some(e => e.includes('PERMISSION_DENIED')) && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-red-800">🔧 วิธีแก้ไขปัญหา Permission:</div>
                <div className="text-sm text-red-700 mt-2 space-y-2">
                  <div><strong>1. แก้ไข Firebase Database Rules:</strong></div>
                  <div className="ml-4">
                    ไปที่ Firebase Console → Database → Rules → แก้ไข rules เป็น:
                  </div>
                  <pre className="text-xs bg-red-100 p-2 rounded ml-4 overflow-x-auto">
{`"items": {
  ".read": true,
  ".write": "auth != null",
  "$itemId": {
    ".validate": "newData.hasChildren(['title','text','domain','label'])",
    "title": { ".validate": "newData.isString()" },
    "text": { ".validate": "newData.isString()" },
    "domain": { ".validate": "newData.isString()" },
    "label": { ".validate": "newData.isNumber() && (newData.val() === 0 || newData.val() === 1)" },
    
    "source": { ".validate": "newData.isString() || newData.val() === null" },
    "publishedAt": { ".validate": "newData.isNumber() || newData.val() === null" },
    "topic": { ".validate": "newData.exists() || newData.val() === null" },
    "createdAt": { ".validate": "newData.isNumber() || newData.val() === null" },
    
    // เพิ่ม fields ใหม่สำหรับ AI analysis
    "clueWords": { ".validate": "newData.exists() || newData.val() === null" },
    "clue_words_analysis": { ".validate": "newData.exists() || newData.val() === null" },
    "confidence": { ".validate": "newData.isNumber() || newData.val() === null" },
    "processedAt": { ".validate": "newData.isNumber() || newData.val() === null" },
    "aiAnalysis": { ".validate": "newData.exists() || newData.val() === null" },
    "ai_reasoning": { ".validate": "newData.isString() || newData.val() === null" }
  }
}`}
                  </pre>
                  <div><strong>2. กด "Publish" เพื่อบันทึก rules</strong></div>
                  <div><strong>3. ลองอัปโหลดใหม่</strong></div>
                  <div className="mt-2 text-xs text-gray-600">
                    <strong>หมายเหตุ:</strong> เพิ่ม fields ใหม่สำหรับ AI analysis: clueWords, clue_words_analysis, confidence, processedAt, aiAnalysis, ai_reasoning
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}