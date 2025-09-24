import React, { useState } from "react";
import { Target, Clock, CheckCircle, XCircle, Brain, AlertTriangle, Trophy } from "lucide-react";

export default function DailyChallenge() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  // Mock data for daily challenges
  const challenges = [
    {
      id: 1,
      title: "ข่าวการเมือง",
      content: "นายกรัฐมนตรีประกาศนโยบายใหม่ที่จะเพิ่มเงินเดือนข้าราชการ 20% เริ่มต้นในเดือนหน้า โดยจะใช้งบประมาณจากภาษีที่เพิ่มขึ้น",
      source: "news-politics.com",
      publishDate: "2025-01-21",
      domain: "politics",
      difficulty: "medium",
      answer: false,
      explanation: "ข้อความนี้มีลักษณะเป็นข่าวปลอมเพราะมีตัวเลขที่เฉพาะเจาะจงมากเกินไป และไม่มีการอ้างอิงแหล่งที่มาที่ชัดเจน"
    },
    {
      id: 2,
      title: "ข่าวสุขภาพ",
      content: "นักวิทยาศาสตร์พบว่าการดื่มน้ำวันละ 8 แก้วสามารถป้องกันโรคมะเร็งได้ 70% จากการศึกษากับผู้ป่วย 10,000 คน",
      source: "health-news.org",
      publishDate: "2025-01-21",
      domain: "health",
      difficulty: "easy",
      answer: false,
      explanation: "ตัวเลขสถิติที่เฉพาะเจาะจงเกินไป และไม่มีลิงก์ไปยังงานวิจัยจริง"
    },
    {
      id: 3,
      title: "ข่าวเทคโนโลยี",
      content: "บริษัท Apple ประกาศเปิดตัว iPhone รุ่นใหม่ที่จะใช้พลังงานแสงอาทิตย์ในการชาร์จแบตเตอรี่ ตามที่ CEO Tim Cook เปิดเผยในการประชุมผู้ถือหุ้น",
      source: "tech-daily.net",
      publishDate: "2025-01-21",
      domain: "technology",
      difficulty: "hard",
      answer: true,
      explanation: "ข่าวนี้ดูน่าเชื่อถือเพราะมีการอ้างอิงบุคคลที่มีชื่อเสียงและเหตุการณ์ที่เป็นไปได้"
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const currentChallenge = challenges[currentQuestion];
  const progress = ((currentQuestion + 1) / challenges.length) * 100;

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Target className="h-4 w-4" />
            <span>Daily Challenge</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ทดสอบวันนี้</h1>
          <p className="text-lg text-gray-600">ฝึกทักษะการแยกแยะข่าวจริง-ปลอม</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              คำถาม {currentQuestion + 1} จาก {challenges.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% เสร็จสิ้น
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>

        {!showFeedback ? (
          /* Challenge Card */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Challenge Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="h-6 w-6" />
                  <span className="font-medium">{currentChallenge.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">ไม่มีเวลาจำกัด</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {currentChallenge.source}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {currentChallenge.publishDate}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {currentChallenge.domain}
                </span>
              </div>
            </div>

            {/* Challenge Content */}
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-lg leading-relaxed text-gray-800">
                  "{currentChallenge.content}"
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  คุณคิดว่าข่าวนี้เป็นข่าวจริงหรือปลอม?
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(currentChallenge.id, true)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      answers[currentChallenge.id] === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <CheckCircle className={`h-8 w-8 ${answers[currentChallenge.id] === true ? 'text-green-500' : 'text-gray-400'}`} />
                      <div className="text-center">
                        <div className="text-xl font-bold">ข่าวจริง</div>
                        <div className="text-sm opacity-75">True</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAnswer(currentChallenge.id, false)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      answers[currentChallenge.id] === false
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <XCircle className={`h-8 w-8 ${answers[currentChallenge.id] === false ? 'text-red-500' : 'text-gray-400'}`} />
                      <div className="text-center">
                        <div className="text-xl font-bold">ข่าวปลอม</div>
                        <div className="text-sm opacity-75">False</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reasoning Input */}
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  เพราะอะไร? (เหตุผลของคุณ)
                </label>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows={4}
                  placeholder="อธิบายเหตุผลในการตัดสินใจของคุณ..."
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ก่อนหน้า
                </button>

                {currentQuestion < challenges.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={answers[currentChallenge.id] === undefined}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    ถัดไป
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={answers[currentChallenge.id] === undefined}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Trophy className="h-5 w-5" />
                    <span>ส่งคำตอบ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Feedback Card */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">เสร็จสิ้น!</h2>
              <p className="text-lg text-gray-600">ผลการทดสอบของคุณ</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">3/3</div>
                <div className="text-sm text-gray-600">คำตอบที่ถูกต้อง</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">ความแม่นยำ</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">+50</div>
                <div className="text-sm text-gray-600">คะแนน</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ทบทวนอีกครั้ง
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                ไปหน้าแรก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}