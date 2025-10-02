import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const hideFooter = location.pathname === "/auth"; // ถ้าอยู่หน้า /auth ซ่อน footer

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-200/60 via-purple-200/50 to-pink-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-gradient-to-tr from-purple-200/60 via-indigo-200/50 to-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_40%)]"></div>
      </div>

      <main className="flex-1">
        {children}
      </main>

      {!hideFooter && (
        <footer className="bg-gray-900 text-white py-12 will-change-auto border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                    <span className="text-white font-bold">TC</span>
                  </div>
                  <span className="text-xl font-bold">TruthCheck</span>
                </div>
                <p className="text-gray-400 mb-4">
                  แพลตฟอร์มฝึกแยกข่าวจริง-ปลอมด้วย AI เพื่อสร้างสังคมที่มีวิจารณญาณ
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">เมนู</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/challenge" className="hover:text-white transition-colors">Daily Challenge</Link></li>
                  <li><Link to="/learn" className="hover:text-white transition-colors">เรียนรู้</Link></li>
                  <li><Link to="/leaderboard" className="hover:text-white transition-colors">อันดับ</Link></li>
                  <li><Link to="/review" className="hover:text-white transition-colors">ประวัติ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">ติดต่อ</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">เกี่ยวกับเรา</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">นโยบาย</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">ช่วยเหลือ</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 TruthCheck. สงวนลิขสิทธิ์.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}


