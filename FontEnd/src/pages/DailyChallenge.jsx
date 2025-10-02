import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, CheckCircle, XCircle, ArrowRight, Home, Brain, Target, ShieldCheck, AlertTriangle } from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = 'http://localhost:8000'; 
// ในแอปจริง, ค่านี้ควรมาจากระบบ Authentication หรือ State Management
const USER_ID = 'user_anonymous_12345'; 

// --- Helper Components ---
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-gray-500">
        <Loader2 className="animate-spin h-12 w-12 mb-4" />
        <p className="text-lg">กำลังโหลดข้อมูล...โปรดรอสักครู่</p>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-red-50 text-red-700 p-8 rounded-lg">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-center">{message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"}</p>
    </div>
);

// --- Main Component ---
export default function DailyChallenge() {
    const [challenges, setChallenges] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState({ label: null, reason: '' });
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchChallenges = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Endpoint ที่ถูกต้องคือ /api/v1/challenges/today
                const response = await fetch(`${API_BASE_URL}/api/v1/challenges/today`);
                if (!response.ok) {
                    throw new Error(`ไม่สามารถดึงข้อมูลโจทย์ได้ (HTTP ${response.status})`);
                }
                const data = await response.json();
                if (!data || data.length === 0) {
                    throw new Error("ไม่พบโจทย์สำหรับวันนี้");
                }
                setChallenges(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    // --- Event Handlers ---
    const handleSubmit = async () => {
        if (userAnswer.label === null) {
            alert("โปรดเลือกคำตอบว่าเป็น 'ข่าวจริง' หรือ 'ข่าวปลอม'");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        const currentChallenge = challenges[currentQuestionIndex];
        
        // ✅ --- START OF FIX ---
        // แก้ไขข้อมูลที่ส่งไปให้ Backend ให้มี userId ตามที่ Backend ต้องการ
        const submissionData = {
            userId: USER_ID, 
            itemRef: currentChallenge.item_id, // <--- ส่ง itemRef ที่นี่ครับ
            userLabel: userAnswer.label,
            userReason: userAnswer.reason,
        };
        // ✅ --- END OF FIX ---

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `เกิดข้อผิดพลาดในการวิเคราะห์ (HTTP ${response.status})`);
            }
            const feedbackData = await response.json();
            setFeedback(feedbackData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleNextQuestion = () => {
        if (currentQuestionIndex < challenges.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setFeedback(null);
            setUserAnswer({ label: null, reason: '' });
            setError(null); // Clear error on next question
        }
    };

    const handleGoHome = () => {
        // ในสถานการณ์จริงอาจจะใช้ react-router-dom เพื่อ navigate
        // สำหรับตอนนี้, จะ reset state เพื่อเริ่มใหม่
        setCurrentQuestionIndex(0);
        setFeedback(null);
        setUserAnswer({ label: null, reason: '' });
        setError(null);
    };

    // --- Memoized Values ---
    const currentChallenge = useMemo(() => challenges[currentQuestionIndex], [challenges, currentQuestionIndex]);
    const isLastQuestion = useMemo(() => currentQuestionIndex === challenges.length - 1, [challenges, currentQuestionIndex]);

    // --- Render Logic ---
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error && !challenges.length) {
        return <ErrorDisplay message={error} />;
    }
    
    if (!challenges || challenges.length === 0) {
        return <div className="text-center p-8">ไม่พบโจทย์สำหรับวันนี้</div>;
    }

    if (feedback) {
        return <FeedbackView 
                    feedback={feedback} 
                    userReason={userAnswer.reason}
                    isLastQuestion={isLastQuestion}
                    onNext={handleNextQuestion}
                    onHome={handleGoHome}
                />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 font-sans">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="w-full bg-gray-200">
                    <div 
                        className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-1 leading-none transition-all duration-500" 
                        style={{ width: `${((currentQuestionIndex + 1) / challenges.length) * 100}%` }}
                    >
                        ข้อที่ {currentQuestionIndex + 1} / {challenges.length}
                    </div>
                </div>
                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{currentChallenge.source || 'แหล่งข่าว'}</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3 mb-4">{currentChallenge.title}</h1>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{currentChallenge.content}</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">คุณคิดว่าข่าวนี้น่าเชื่อถือหรือไม่?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setUserAnswer({ ...userAnswer, label: true })}
                                    className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${userAnswer.label === true ? 'bg-green-100 border-green-500 text-green-700 scale-105 shadow-md' : 'bg-white border-gray-300 hover:border-green-400'}`}
                                >
                                    <ShieldCheck className="mr-3 h-6 w-6" />
                                    <span className="font-semibold text-lg">ข่าวจริง</span>
                                </button>
                                <button
                                    onClick={() => setUserAnswer({ ...userAnswer, label: false })}
                                    className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${userAnswer.label === false ? 'bg-red-100 border-red-500 text-red-700 scale-105 shadow-md' : 'bg-white border-gray-300 hover:border-red-400'}`}
                                >
                                    <AlertTriangle className="mr-3 h-6 w-6" />
                                    <span className="font-semibold text-lg">ข่าวปลอม</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">โปรดให้เหตุผลของคุณ:</h2>
                            <textarea
                                value={userAnswer.reason}
                                onChange={(e) => setUserAnswer({ ...userAnswer, reason: e.target.value })}
                                className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="เช่น: 'คำว่า colossal เป็นคำที่ฟังดูเว่อร์มากเกินไป' "
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || userAnswer.label === null}
                                className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="animate-spin h-5 w-5 mr-3" />กำลังวิเคราะห์...</>
                                ) : ( 'ส่งคำตอบ' )}
                            </button>
                             {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeedbackView({ feedback, userReason, isLastQuestion, onNext, onHome }) {
    const scoreColor = feedback.score >= 75 ? 'text-green-500' : feedback.score >= 50 ? 'text-yellow-500' : 'text-red-500';
    
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 font-sans animate-fade-in">
             <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8">
                <div className={`text-center mb-6 p-4 rounded-lg ${feedback.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <h1 className="text-3xl font-bold">{feedback.correct ? 'คุณตอบถูก!' : 'คุณตอบผิด'}</h1>
                    <p className="mt-1">{feedback.explanation}</p>
                </div>
                
                <div className="text-center mb-8">
                     <p className="text-lg text-gray-600">คะแนนการวิเคราะห์ของคุณคือ</p>
                     <p className={`text-7xl font-bold ${scoreColor}`}>{feedback.score}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Target className="mr-3 text-blue-500" />จุดที่ควรสังเกต (Clue Words)</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
                            {feedback.clue_words_analysis && feedback.clue_words_analysis.length > 0 ? (
                                <ul className="space-y-4">
                                    {feedback.clue_words_analysis.map((clue, index) => (
                                        <li key={index} className="flex items-start">
                                            {clue.found_in_reason ? 
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" /> : 
                                                <XCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                            }
                                            <div>
                                                <p className="font-semibold text-gray-700">"{clue.word}"</p>
                                                <p className="text-sm text-gray-500">{clue.analysis}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p className="text-gray-500">โมเดลไม่พบคำสำคัญที่ชัดเจนในข่าวนี้</p>)}
                        </div>
                         {feedback.suggestions && feedback.suggestions.length > 0 && (
                             <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">คำแนะนำเพิ่มเติม</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                  {feedback.suggestions.map((s, i) => <li key={i}>{s.text}</li>)}
                                </ul>
                             </div>
                         )}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Brain className="mr-3 text-purple-500" />เหตุผลของคุณ</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                            <p className="text-gray-600 italic whitespace-pre-wrap">{userReason || "คุณไม่ได้ระบุเหตุผล"}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={onHome} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                       <Home className="mr-2 h-5 w-5" />กลับหน้าแรก
                    </button>
                    {!isLastQuestion && (
                         <button onClick={onNext} className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            ข้อถัดไป<ArrowRight className="ml-2 h-5 w-5" />
                         </button>
                    )}
                </div>
            </div>
        </div>
    );
}

