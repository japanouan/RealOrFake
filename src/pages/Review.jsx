import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, Eye, Filter, Calendar, Target, TrendingUp, BookOpen } from "lucide-react";

export default function Review() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const filters = [
    { id: "all", label: "ทั้งหมด", icon: Target },
    { id: "correct", label: "ถูกต้อง", icon: CheckCircle },
    { id: "incorrect", label: "ผิด", icon: XCircle },
    { id: "politics", label: "การเมือง", icon: BookOpen },
    { id: "health", label: "สุขภาพ", icon: BookOpen },
    { id: "technology", label: "เทคโนโลยี", icon: BookOpen }
  ];

  const dateFilters = [
    { id: "all", label: "ทั้งหมด" },
    { id: "today", label: "วันนี้" },
    { id: "week", label: "สัปดาห์นี้" },
    { id: "month", label: "เดือนนี้" }
  ];

  // Mock data for review history
  const reviewHistory = [
    {
      id: 1,
      title: "ข่าวการเมือง",
      content: "นายกรัฐมนตรีประกาศนโยบายใหม่ที่จะเพิ่มเงินเดือนข้าราชการ 20%",
      source: "news-politics.com",
      date: "2025-01-21",
      domain: "politics",
      difficulty: "medium",
      userAnswer: false,
      correctAnswer: false,
      isCorrect: true,
      explanation: "ข้อความนี้มีลักษณะเป็นข่าวปลอมเพราะมีตัวเลขที่เฉพาะเจาะจงมากเกินไป และไม่มีการอ้างอิงแหล่งที่มาที่ชัดเจน",
      userReason: "ตัวเลขดูเกินจริงและไม่มีแหล่งอ้างอิง",
      timeSpent: 45,
      accuracy: 85
    },
    {
      id: 2,
      title: "ข่าวสุขภาพ",
      content: "นักวิทยาศาสตร์พบว่าการดื่มน้ำวันละ 8 แก้วสามารถป้องกันโรคมะเร็งได้ 70%",
      source: "health-news.org",
      date: "2025-01-20",
      domain: "health",
      difficulty: "easy",
      userAnswer: false,
      correctAnswer: false,
      isCorrect: true,
      explanation: "ตัวเลขสถิติที่เฉพาะเจาะจงเกินไป และไม่มีลิงก์ไปยังงานวิจัยจริง",
      userReason: "ตัวเลขดูเกินจริงและไม่มีงานวิจัยอ้างอิง",
      timeSpent: 30,
      accuracy: 90
    },
    {
      id: 3,
      title: "ข่าวเทคโนโลยี",
      content: "บริษัท Apple ประกาศเปิดตัว iPhone รุ่นใหม่ที่จะใช้พลังงานแสงอาทิตย์ในการชาร์จแบตเตอรี่",
      source: "tech-daily.net",
      date: "2025-01-19",
      domain: "technology",
      difficulty: "hard",
      userAnswer: true,
      correctAnswer: true,
      isCorrect: true,
      explanation: "ข่าวนี้ดูน่าเชื่อถือเพราะมีการอ้างอิงบุคคลที่มีชื่อเสียงและเหตุการณ์ที่เป็นไปได้",
      userReason: "Apple เป็นบริษัทที่เชื่อถือได้และเทคโนโลยีนี้เป็นไปได้",
      timeSpent: 60,
      accuracy: 95
    },
    {
      id: 4,
      title: "ข่าวสังคม",
      content: "นักเรียนชั้น ม.6 คนหนึ่งสามารถแก้ปัญหาคณิตศาสตร์ที่ยากที่สุดในโลกได้ในเวลา 5 นาที",
      source: "amazing-news.com",
      date: "2025-01-18",
      domain: "society",
      difficulty: "easy",
      userAnswer: true,
      correctAnswer: false,
      isCorrect: false,
      explanation: "ข่าวนี้ดูเกินจริงมาก ไม่มีการอ้างอิงงานวิจัยหรือสถาบันที่เกี่ยวข้อง",
      userReason: "คิดว่าเป็นเรื่องจริงเพราะมีรายละเอียดที่เฉพาะเจาะจง",
      timeSpent: 25,
      accuracy: 70
    }
  ];

  const filteredData = reviewHistory.filter(item => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "correct") return item.isCorrect;
    if (selectedFilter === "incorrect") return !item.isCorrect;
    return item.domain === selectedFilter;
  });

  const stats = {
    totalQuestions: reviewHistory.length,
    correctAnswers: reviewHistory.filter(item => item.isCorrect).length,
    accuracy: Math.round((reviewHistory.filter(item => item.isCorrect).length / reviewHistory.length) * 100),
    averageTime: Math.round(reviewHistory.reduce((acc, item) => acc + item.timeSpent, 0) / reviewHistory.length),
    streak: 5
  };

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
            {/* Category Filter */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">หมวดหมู่</h3>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedFilter === filter.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:opacity-95"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                  <p className="text-lg leading-relaxed text-gray-800">"{item.content}"</p>
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
                    <p className="text-gray-700 italic">"{item.userReason}"</p>
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
                    <p className="text-gray-700">{item.explanation}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{item.timeSpent} วินาที</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">{item.accuracy}% ความแม่นยำ</span>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูล</h3>
            <p className="text-gray-600 mb-6">ยังไม่มีประวัติการทำข้อสอบในหมวดหมู่นี้</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              เริ่มทำข้อสอบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}