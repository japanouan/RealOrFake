import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { onValue, ref, update, set } from "firebase/database";
import { ArrowLeft, ChevronDown, ChevronUp, Trash2, AlertTriangle } from "lucide-react";

export default function AdminItemsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const itemsRef = ref(db, "items");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const value = snapshot.val() || {};
      const list = Object.keys(value).map((key) => ({ id: key, ...value[key] }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setItems(list);
      setLoading(false);
    }, (err) => {
      console.error("[AdminItemsManager] /items read failed:", err.code, err.message);
      setError(err.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(items.map((i) => i.id)));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`ลบข่าวที่เลือกไว้ ${selectedIds.size} รายการ? การกระทำนี้ย้อนกลับไม่ได้`)) return;

    setDeleting(true);
    try {
      const updates = {};
      selectedIds.forEach((id) => { updates[`items/${id}`] = null; });
      await update(ref(db), updates);
      setSelectedIds(new Set());
      setExpandedId(null);
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการลบ: " + (e.message || e));
    } finally {
      setDeleting(false);
    }
  };

  const deleteAllItems = async () => {
    if (!window.confirm("ลบข่าวทั้งหมดในระบบ? การกระทำนี้ย้อนกลับไม่ได้!")) return;
    setDeleting(true);
    try {
      await set(ref(db, "items"), null);
      setSelectedIds(new Set());
      setExpandedId(null);
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการลบ: " + (e.message || e));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleString();
    } catch {
      return String(value);
    }
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> กลับไปหน้า Admin Panel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">จัดการรายการข่าวทั้งหมด</h1>
            <p className="text-gray-600 mt-1">ดู เลือกหลายรายการ และลบข่าวที่ไม่ต้องการ ({items.length} รายการทั้งหมด)</p>
          </div>
          <button
            onClick={deleteAllItems}
            disabled={deleting || items.length === 0}
            className="bg-red-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-5 w-5" />
            <span>ลบข่าวทั้งหมดในระบบ</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>ไม่สามารถโหลดรายการข่าวได้: {error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center justify-between">
          <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} disabled={items.length === 0} />
            <span>เลือกทั้งหมด</span>
          </label>
          <button
            onClick={deleteSelected}
            disabled={deleting || selectedIds.size === 0}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            <span>ลบรายการที่เลือก ({selectedIds.size})</span>
          </button>
        </div>

        <div className="space-y-3">
          {loading && <div className="text-center text-gray-500 py-8">กำลังโหลด...</div>}
          {!loading && items.length === 0 && (
            <div className="text-center text-gray-500 py-8 bg-white rounded-2xl shadow-lg">ไม่พบข่าวในระบบ</div>
          )}
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            const isFake = item.label === 0;
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex items-start p-4 gap-3">
                  <input
                    type="checkbox"
                    className="mt-1.5"
                    checked={selectedIds.has(item.id)}
                    onChange={(e) => { e.stopPropagation(); toggleSelectOne(item.id); }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="flex-1 text-left"
                    style={{ transform: "scale(1)" }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate pr-4">{item.title || "(ไม่มีหัวข้อ)"}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isFake ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isFake ? 'ข่าวปลอม' : 'ข่าวจริง'}
                        </span>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-gray-500 truncate mt-1">{item.text}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{item.domain || 'ไม่ระบุแหล่งที่มา'}</span>
                      <span>•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">รหัสข่าว (ID)</p>
                      <p className="text-sm text-gray-800 font-mono">{item.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">หัวข้อข่าวเต็ม</p>
                      <p className="text-sm text-gray-800">{item.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Domain</p>
                      <p className="text-sm text-gray-800">{item.domain || 'ไม่ระบุแหล่งที่มา'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">เนื้อหาข่าว</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.text}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">สร้างเมื่อ</p>
                      <p className="text-sm text-gray-800">{formatDate(item.createdAt)}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">เฉลย</p>
                      <p className="text-sm text-gray-800 mb-2">
                        ป้ายกำกับ: <span className={`font-semibold ${isFake ? 'text-red-600' : 'text-green-600'}`}>{isFake ? 'ข่าวปลอม' : 'ข่าวจริง'}</span>
                      </p>
                      {Array.isArray(item.clueWords) && item.clueWords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {item.clueWords.map((w, i) => (
                            <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{w}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">ไม่มีคำสำคัญ (clueWords)</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
