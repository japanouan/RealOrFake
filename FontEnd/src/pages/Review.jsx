import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Eye, Filter, Calendar, Target, TrendingUp, BookOpen } from "lucide-react";
import { ref, get, onValue, off } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function Review() {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState("all");
  const [reviewHistory, setReviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const dateFilters = [
    { id: "all", label: "ทั้งหมด" },
    { id: "today", label: "วันนี้" },
    { id: "week", label: "สัปดาห์นี้" },
    { id: "month", label: "เดือนนี้" }
  ];

  // Fetch user submissions from Firebase
  const fetchUserSubmissions = async (userId) => {
    try {
      console.log("Fetching submissions for user:", userId);
      const submissionsRef = ref(db, `submissions/${userId}`);
      const snapshot = await get(submissionsRef);
      
      if (snapshot.exists()) {
        const submissions = snapshot.val();
        console.log("Found submissions:", submissions);
        const submissionList = [];
        
        // Iterate through date folders (e.g., "2025-10-04")
        for (const [dateKey, dateSubmissions] of Object.entries(submissions)) {
          if (typeof dateSubmissions === 'object' && dateSubmissions !== null) {
            // Iterate through individual submissions in each date
            for (const [submissionId, submission] of Object.entries(dateSubmissions)) {
              try {
                console.log(`Processing submission ${submissionId} from date ${dateKey}:`, submission);
                
                // Fetch item details using itemRef
                let itemData = null;
                if (submission.itemRef) {
                  try {
                    const itemRef = ref(db, submission.itemRef);
                    const itemSnapshot = await get(itemRef);
                    if (itemSnapshot.exists()) {
                      itemData = itemSnapshot.val();
                      console.log("Item data:", itemData);
                    }
                  } catch (itemError) {
                    console.warn(`Could not fetch item for submission ${submissionId}:`, itemError);
                  }
                }
                
                // Create submission data combining submission and item data
                // Handle both boolean and number formats for userLabel
                const userAnswer = submission.userLabel === 1 || submission.userLabel === true;
                
                // Check if modelLabel exists, if not, use item's label as fallback
                let correctAnswer;
                if (submission.modelLabel !== undefined && submission.modelLabel !== null) {
                  correctAnswer = submission.modelLabel === 1 || submission.modelLabel === true;
                } else if (itemData?.label !== undefined && itemData?.label !== null) {
                  correctAnswer = itemData.label === 1 || itemData.label === true;
                } else {
                  // If no model label or item label, assume it's fake news (0/false)
                  correctAnswer = false;
                }
                
                const isCorrect = userAnswer === correctAnswer;
                
                console.log(`Submission ${submissionId} data:`, {
                  userLabel: submission.userLabel,
                  modelLabel: submission.modelLabel,
                  itemLabel: itemData?.label,
                  userAnswer: userAnswer,
                  correctAnswer: correctAnswer,
                  isCorrect: isCorrect,
                  submission: submission,
                  itemData: itemData
                });
                
                const submissionData = {
                  id: submissionId,
                  title: itemData?.title || "ไม่มีชื่อเรื่อง",
                  content: itemData?.text || "ไม่มีเนื้อหา",
                  source: itemData?.domain || "ไม่ระบุแหล่งที่มา",
                  date: submission.createdAt ? new Date(submission.createdAt).toLocaleDateString('th-TH') : dateKey,
                  domain: itemData?.topic?.[0] || "general",
                  difficulty: itemData?.difficulty || "medium",
                  userAnswer: userAnswer,
                  correctAnswer: correctAnswer,
                  isCorrect: isCorrect,
                  explanation: submission.explanation || "ไม่มีคำอธิบาย",
                  userReason: submission.userReason || "ไม่ระบุเหตุผล",
                  timeSpent: submission.durationSec || 0,
                  accuracy: submission.modelProbTrue ? Math.round(submission.modelProbTrue * 100) : 0,
                  createdAt: submission.createdAt || new Date().toISOString(),
                  dateKey: dateKey,
                  // Additional fields from actual structure
                  modelLabel: submission.modelLabel,
                  modelProbTrue: submission.modelProbTrue,
                  userLabel: submission.userLabel,
                  // Item reference for debugging
                  itemRef: submission.itemRef
                };
                submissionList.push(submissionData);
              } catch (itemError) {
                console.error(`Error processing submission ${submissionId}:`, itemError);
                // Continue with other submissions even if one fails
              }
            }
          }
        }
        
        // Sort by date (newest first)
        submissionList.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
        console.log("Processed submissions:", submissionList);
        setReviewHistory(submissionList);
      } else {
        console.log("No submissions found for user");
        setReviewHistory([]);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      setError(null);
      fetchUserSubmissions(currentUser.uid);
    } else {
      setLoading(false);
      setReviewHistory([]);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // No cleanup needed for get() calls, but good practice to have the return
    };
  }, [currentUser]);

  // Use real data from Firebase, fallback to empty array if no data
  const dataToUse = reviewHistory.length > 0 ? reviewHistory : [];

  const filteredData = dataToUse.filter(item => {
    // Filter by date only
    let dateMatch = true;
    if (selectedDate !== "all") {
      const now = new Date();
      const itemDate = new Date(item.createdAt);
      
      switch (selectedDate) {
        case "today":
          dateMatch = itemDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateMatch = itemDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateMatch = itemDate >= monthAgo;
          break;
        default:
          dateMatch = true;
      }
    }

    return dateMatch;
  });

  const stats = {
    totalQuestions: dataToUse.length,
    correctAnswers: dataToUse.filter(item => item.isCorrect).length,
    accuracy: dataToUse.length > 0 ? Math.round((dataToUse.filter(item => item.isCorrect).length / dataToUse.length) * 100) : 0,
    averageTime: dataToUse.length > 0 ? Math.round(dataToUse.reduce((acc, item) => acc + (item.timeSpent || 0), 0) / dataToUse.length) : 0,
    streak: 5 // This could be fetched from user stats if needed
  };

  // Debug logging for stats calculation
  console.log("Stats calculation:", {
    totalQuestions: dataToUse.length,
    correctAnswers: dataToUse.filter(item => item.isCorrect).length,
    allItems: dataToUse.map(item => ({
      id: item.id,
      isCorrect: item.isCorrect,
      userAnswer: item.userAnswer,
      correctAnswer: item.correctAnswer,
      userLabel: item.userLabel,
      modelLabel: item.modelLabel
    }))
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDomainIcon = (domain) => {
    switch (domain) {
      case "politics":
        return "🏛️";
      case "health":
        return "🏥";
      case "technology":
        return "💻";
      case "society":
        return "👥";
      default:
        return "📰";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-8 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              <span>Review & History</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ประวัติและทบทวน</h1>
            <p className="text-lg text-gray-600">กำลังโหลดข้อมูลจาก Firebase...</p>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">กำลังดึงข้อมูลประวัติการทำข้อสอบ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen className="h-4 w-4" />
              <span>Review & History</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ประวัติและทบทวน</h1>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">เกิดข้อผิดพลาด</span>
              </div>
              <p className="text-red-600">{error}</p>
            </div>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                currentUser && fetchUserSubmissions(currentUser.uid);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            <span>Review & History</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ประวัติและทบทวน</h1>
          <p className="text-lg text-gray-600">ดูผลงานที่ผ่านมาและเรียนรู้จากข้อผิดพลาด</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalQuestions}</div>
            <div className="text-sm text-gray-600">คำถามทั้งหมด</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.correctAnswers}</div>
            <div className="text-sm text-gray-600">คำตอบที่ถูก</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.accuracy}%</div>
            <div className="text-sm text-gray-600">ความแม่นยำ</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.averageTime}s</div>
            <div className="text-sm text-gray-600">เวลาเฉลี่ย</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Date Filter */}
            <div>
  <h3 className="text-lg font-semibold text-gray-900 mb-3">ช่วงเวลา</h3>
  <div className="flex flex-wrap gap-2">
    {dateFilters.map((filter) => (
      <button
        key={filter.id}
        onClick={() => setSelectedDate(filter.id)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
          selectedDate === filter.id
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:opacity-95"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {filter.label}
      </button>
    ))}
  </div>
</div>

          </div>
        </div>

        {/* Review History */}
        <div className="space-y-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className={`p-6 ${
                item.isCorrect 
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500' 
                  : 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getDomainIcon(item.domain)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">{item.source}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <p className="text-lg leading-relaxed text-gray-800">
                    {item.content && item.content !== "ไม่มีเนื้อหา" ? `"${item.content}"` : "ไม่มีเนื้อหาข่าว"}
                  </p>
                </div>

                {/* Analysis */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* User Answer */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">คำตอบของคุณ</h4>
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium mb-3 ${
                      item.userAnswer 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.userAnswer ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{item.userAnswer ? 'ข่าวจริง' : 'ข่าวปลอม'}</span>
                    </div>
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-1">
                      Debug: userLabel={item.userLabel}, userAnswer={item.userAnswer ? 'true' : 'false'}
                    </div>
                    <p className="text-gray-700 italic">
                      {item.userReason && item.userReason !== "ไม่ระบุเหตุผล" ? `"${item.userReason}"` : "ไม่ระบุเหตุผล"}
                    </p>
                  </div>

                  {/* Correct Answer */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">คำตอบที่ถูกต้อง</h4>
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium mb-3 ${
                      item.correctAnswer 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.correctAnswer ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{item.correctAnswer ? 'ข่าวจริง' : 'ข่าวปลอม'}</span>
                    </div>
                    {/* Debug info for correct answer */}
                    <div className="text-xs text-gray-500 mt-1">
                      Debug: modelLabel={item.modelLabel}, correctAnswer={item.correctAnswer ? 'true' : 'false'}
                    </div>
                    <p className="text-gray-700">
                      {item.explanation && item.explanation !== "ไม่มีคำอธิบาย" ? item.explanation : "คำตอบที่ถูกต้องตามระบบ AI"}
                    </p>
                    {item.modelProbTrue && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">ความมั่นใจของ AI:</span> {Math.round(item.modelProbTrue * 100)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {item.dateKey && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">วันที่ทำ:</span> {item.dateKey}
                      </div>
                      <div>
                        <span className="font-semibold">Submission ID:</span> {item.id}
                      </div>
                      <div>
                        <span className="font-semibold">Model Probability:</span> {item.accuracy}%
                      </div>
                    </div>
                    {(item.modelLabel !== undefined || item.userLabel !== undefined) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">User Label:</span> {item.userLabel === 1 ? 'ข่าวจริง' : 'ข่าวปลอม'}
                          </div>
                          <div>
                            <span className="font-semibold">Model Label:</span> {item.modelLabel === 1 ? 'ข่าวจริง' : 'ข่าวปลอม'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{item.timeSpent || 0} วินาที</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">{item.accuracy || 0}% ความแม่นยำ</span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>ดูรายละเอียด</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {dataToUse.length === 0 ? "ยังไม่มีประวัติการทำข้อสอบ" : "ไม่พบข้อมูลในช่วงเวลานี้"}
            </h3>
            <p className="text-gray-600 mb-6">
              {dataToUse.length === 0 
                ? "เริ่มทำข้อสอบเพื่อดูประวัติและสถิติของคุณ" 
                : "ลองเปลี่ยนช่วงเวลาที่เลือก"
              }
            </p>
            {dataToUse.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
                <p className="text-blue-600 text-sm">
                  💡 <strong>เคล็ดลับ:</strong> ไปที่หน้า "เรียนรู้" หรือ "ท้าทายรายวัน" เพื่อเริ่มทำข้อสอบ
                </p>
              </div>
            )}
            <button 
              onClick={() => {
                if (dataToUse.length === 0) {
                  // Navigate to learn page or daily challenge
                  window.location.href = '/learn';
                } else {
                  // Reset date filter
                  setSelectedDate('all');
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {dataToUse.length === 0 ? "เริ่มทำข้อสอบ" : "ดูทั้งหมด"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}