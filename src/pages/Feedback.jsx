import React, { useState } from "react";
import { CheckCircle, XCircle, Brain, AlertTriangle, Target, Trophy, ArrowRight, Star } from "lucide-react";

export default function Feedback() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Mock feedback data
  const feedbackData = [
    {
      id: 1,
      question: "ข่าวการเมือง",
      content: "นายกรัฐมนตรีประกาศนโยบายใหม่ที่จะเพิ่มเงินเดือนข้าราชการ 20% เริ่มต้นในเดือนหน้า",
      userAnswer: false,
      correctAnswer: false,
      isCorrect: true,
      userReason: "ตัวเลขดูเกินจริงและไม่มีแหล่งอ้างอิง",
      explanation: "ข้อความนี้มีลักษณะเป็นข่าวปลอมเพราะมีตัวเลขที่เฉพาะเจาะจงมากเกินไป และไม่มีการอ้างอิงแหล่งที่มาที่ชัดเจน",
      aiAnalysis: {
        confidence: 0.85,
        keywords: ["เงินเดือน", "20%", "ข้าราชการ"],
        attentionWeights: [
          { word: "20%", weight: 0.9, reason: "ตัวเลขเฉพาะเจาะจงเกินไป" },
          { word: "ข้าราชการ", weight: 0.7, reason: "คำที่ใช้บ่อยในข่าวปลอม" },
          { word: "เดือนหน้า", weight: 0.6, reason: "กำหนดเวลาที่ไม่ชัดเจน" }
        ]
      },
      tips: [
        "ตรวจสอบแหล่งที่มาของข่าว",
        "ดูว่ามีการอ้างอิงงานวิจัยหรือไม่",
        "เปรียบเทียบกับข่าวจากแหล่งอื่น"
      ],
      score: 85,
      timeSpent: 45
    }
  ];

  const currentFeedback = feedbackData[currentQuestion];

  const getAttentionColor = (weight) => {
    if (weight >= 0.8) return "bg-red-100 text-red-800 border-red-200";
    if (weight >= 0.6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Brain className="h-4 w-4" />
            <span>AI Feedback</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ผลการวิเคราะห์</h1>
          <p className="text-lg text-gray-600">ดูผลการวิเคราะห์และเรียนรู้จาก AI</p>
        </div>

        {/* Main Feedback Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Result Header */}
          <div className={`p-6 ${
            currentFeedback.isCorrect 
              ? 'bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500' 
              : 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {currentFeedback.isCorrect ? (
                  <div className="bg-green-500 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 p-3 rounded-full">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentFeedback.isCorrect ? 'คำตอบถูกต้อง!' : 'คำตอบผิด'}
                  </h2>
                  <p className="text-gray-600">
                    {currentFeedback.isCorrect 
                      ? 'คุณตอบถูกแล้ว มาดูการวิเคราะห์กัน' 
                      : 'ไม่เป็นไร มาดูการวิเคราะห์เพื่อเรียนรู้'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{currentFeedback.score}</div>
                <div className="text-sm text-gray-600">คะแนน</div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🏛️</span>
              <h3 className="text-xl font-semibold text-gray-900">{currentFeedback.question}</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg leading-relaxed text-gray-800">
                "{currentFeedback.content}"
              </p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span>การวิเคราะห์ของ AI</span>
            </h3>

            {/* Confidence Score */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">ระดับความมั่นใจ</h4>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(currentFeedback.aiAnalysis.confidence * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                  style={{width: `${currentFeedback.aiAnalysis.confidence * 100}%`}}
                ></div>
              </div>
            </div>

            {/* Attention Weights */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">คำสำคัญที่ AI วิเคราะห์</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {currentFeedback.aiAnalysis.attentionWeights.map((item, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${getAttentionColor(item.weight)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg">{item.word}</span>
                      <span className="text-sm font-medium">
                        {Math.round(item.weight * 100)}%
                      </span>
                    </div>
                    <p className="text-sm opacity-75">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* User vs AI Analysis */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* User Answer */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>คำตอบของคุณ</span>
                </h4>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium mb-3 ${
                  currentFeedback.userAnswer 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentFeedback.userAnswer ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span>{currentFeedback.userAnswer ? 'ข่าวจริง' : 'ข่าวปลอม'}</span>
                </div>
                <p className="text-gray-700 italic">"{currentFeedback.userReason}"</p>
              </div>

              {/* AI Explanation */}
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span>คำอธิบาย AI</span>
                </h4>
                <p className="text-gray-700">{currentFeedback.explanation}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-600" />
                <span>เคล็ดลับสำหรับครั้งต่อไป</span>
              </h4>
              <ul className="space-y-2">
                {currentFeedback.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{currentFeedback.score}</div>
            <div className="text-sm text-gray-600">คะแนนที่ได้</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{currentFeedback.timeSpent}s</div>
            <div className="text-sm text-gray-600">เวลาที่ใช้</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
            <div className="text-sm text-gray-600">ความแม่นยำ</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">+50</div>
            <div className="text-sm text-gray-600">คะแนนเพิ่ม</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>รายงานปัญหา</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>ทำข้อสอบต่อไป</span>
          </button>
        </div>
      </div>
    </div>
  );
}