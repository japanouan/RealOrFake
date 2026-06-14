import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom"; // <-- เพิ่ม useNavigate ที่นี่
import { Loader2, CheckCircle, XCircle, ArrowRight, Home, Brain, Target, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_FIREBASE_API_BASE_URL;

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

// --- NEW Component: โจทย์ครบแล้ว ---
const CompletedView = ({ onHome }) => (
    <div className="max-w-xl mx-auto p-8 font-sans animate-fade-in">
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">ยินดีด้วย! 🏆</h1>
            <p className="text-xl text-gray-600 mb-8">คุณทำภารกิจประจำวันครบทุกข้อแล้ว</p>
            <button
                onClick={onHome}
                className="w-full sm:w-auto mx-auto centered-buttons flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
            >
                <Home className="mr-2 h-5 w-5" />
                กลับหน้าหลัก
            </button>
        </div>
    </div>
);

// --- Main Component ---
export default function DailyChallenge() {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate(); // <-- เรียกใช้ useNavigate hook
    const [userId, setUserId] = useState('user_anonymous_12345');

    const [challenges, setChallenges] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [limit, setLimit] = useState(0);
    const [userAnswer, setUserAnswer] = useState({ label: null, selectedWords: [] });
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // --- ตรวจสอบ Auth และเซ็ต userId ---
    useEffect(() => {
        if (currentUser) setUserId(currentUser.uid);
    }, [currentUser, loading]);

    // --- Fetch challenges ---
    useEffect(() => {
        if (!userId) return;

        const generateAndFetchChallenges = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log("%c🚀 Generating today's challenge...", "color: orange;");

                // --- สร้าง Daily Challenge ---
                const generateResponse = await fetch(`${API_BASE_URL}/api/v1/dailychallenges/today`);
                if (!generateResponse.ok) {
                    throw new Error(`❌ ไม่สามารถสร้าง Daily Challenge ได้ (HTTP ${generateResponse.status})`);
                }
                const generatedData = await generateResponse.json();
                console.log("%c✅ Daily Challenge generated successfully:", "color: green;");

                // --- ดึงโจทย์หลังจากสร้างสำเร็จ ---
                console.log("%c📥 Fetching today's challenges...", "color: blue;");
                const fetchResponse = await fetch(`${API_BASE_URL}/api/v1/challenges/today?userId=${userId}`);
                if (!fetchResponse.ok) {
                    throw new Error(`ไม่สามารถดึงข้อมูลโจทย์ได้ (HTTP ${fetchResponse.status})`);
                }
                const fetchedData = await fetchResponse.json();
                if (!fetchedData || fetchedData.length === 0) throw new Error("ไม่พบโจทย์สำหรับวันนี้");
                // console.log(fetchedData)
                setChallenges(fetchedData);

                // --- ตั้งค่าค่าเริ่มต้น ---
                setCurrentQuestionIndex(0);
                setUserAnswer({ label: null, selectedWords: [] });
                setFeedback(null);
                const currentChallenge = await fetch(`${API_BASE_URL}/api/v1/dailychallenges/today/index?user_id=${currentUser.uid}`);
                if (!currentChallenge.ok) {
                    throw new Error(`ไม่สามารถดึงข้อมูลโจทย์ได้ (HTTP ${currentChallenge.status})`);
                }
                const currentChallengeIndex = await currentChallenge.json();
                setCurrentQuestionIndex(currentChallengeIndex);
                const todayLimitRef = await fetch(`${API_BASE_URL}/api/v1/dailychallenges/today/limit`);
                if (!currentChallenge.ok) {
                    throw new Error(`ไม่สามารถดึงข้อมูลโจทย์ได้ (HTTP ${currentChallenge.status})`);
                }
                const todayLimit = await todayLimitRef.json();
                setLimit(todayLimit);


            } catch (err) {
                console.error("%c🔥 Error:", "color: red;", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        generateAndFetchChallenges();
    }, [userId]);


    const currentChallenge = useMemo(() => challenges[currentQuestionIndex], [challenges, currentQuestionIndex]);

    // --- แยกคำสำหรับ checkbox พร้อมแยก ' และ ’ ออก ---
    const challengeWords = useMemo(() => {
        if (!currentChallenge?.title) return [];
        // แยกคำ, แยก ' และ ’ เป็นคำเดี่ยว
        const words = currentChallenge.title
            .replace(/’/g, " ’ ") // ใส่ space รอบ ๆ ’
            .replace(/'/g, " ' ") // ใส่ space รอบ ๆ '
            .split(/\s+/)
            .filter(Boolean);
        return [...new Set(words)];
    }, [currentChallenge]);

    // --- Handler เลือกคำ ---
    const handleWordSelection = (word) => {
        setUserAnswer(prev => {
            const newSelectedWords = prev.selectedWords.includes(word)
                ? prev.selectedWords.filter(w => w !== word)
                : [...prev.selectedWords, word];
            return { ...prev, selectedWords: newSelectedWords };
        });
    };

    // --- Submit ไป backend ---
    const handleSubmit = async () => {
        if (userAnswer.label === null) {
            setError("โปรดเลือกคำตอบว่าเป็น 'ข่าวจริง' หรือ 'ข่าวปลอม'");
            return;
        }
        if (userAnswer.selectedWords.length === 0) {
            setError("โปรดเลือกคำสำคัญอย่างน้อย 1 คำ");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const submissionData = {
            userId: userId,
            itemRef: currentChallenge.item_id,
            userLabel: userAnswer.label,
            userClues: userAnswer.selectedWords,
        };

        // console.log('Submitting data to backend:', submissionData);

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
            // console.log('Feedback received from backend:', feedbackData);
            setFeedback({ ...feedbackData, submission: submissionData });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- ไปข้อถัดไป ---
    const handleNextQuestion = () => {
        if (currentQuestionIndex < challenges.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedback(null);
            setUserAnswer({ label: null, selectedWords: [] });
            setError(null);
        }
    };

    const handleGoHome = () => {
        setCurrentQuestionIndex(0);
        setFeedback(null);
        setUserAnswer({ label: null, selectedWords: [] });
        setError(null);
        navigate('/'); // <--- ใช้ navigate ที่นี่
    };

    const isLastQuestion = useMemo(() => currentQuestionIndex === challenges.length - 1, [challenges, currentQuestionIndex]);

    // --- Render ---
    if (isLoading) return <LoadingSpinner />;
    if (error && !challenges.length) return <ErrorDisplay message={error} />;
    if (!challenges || challenges.length === 0) return <div className="text-center p-8">ไม่พบโจทย์สำหรับวันนี้</div>;
    
    // --- เงื่อนไขใหม่: แสดงหน้าทำโจทย์ครบแล้ว ---
    if (currentQuestionIndex === limit) { 
        return <CompletedView onHome={() => navigate('/')} />; // <--- แสดง Component ใหม่
    }
    
    if (feedback) return <FeedbackView feedbackData={feedback} originalTitleWords={challengeWords} isLastQuestion={isLastQuestion} onNext={handleNextQuestion} onHome={() => navigate('/')} />;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 font-sans">
            {/* UI แสดงโจทย์ */}
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
                        {/* Word selection */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">เลือกคำที่ส่งผลต่อการตัดสินใจของคุณ:</h2>
                            <div className="flex flex-wrap gap-2 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                                {challengeWords.map((word, index) => (
                                    <label key={index} className={`cursor-pointer px-3 py-2 rounded-md transition-all duration-200 border-2 ${userAnswer.selectedWords.includes(word) ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-gray-300 hover:border-blue-400'}`}>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={userAnswer.selectedWords.includes(word)}
                                            onChange={() => handleWordSelection(word)}
                                        />
                                        <span className="font-medium">{word}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Label selection */}
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

                        {/* Submit button */}
                        <div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || userAnswer.label === null || userAnswer.selectedWords.length === 0}
                                className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (<><Loader2 className="animate-spin h-5 w-5 mr-3" />กำลังวิเคราะห์...</>) : ('ส่งคำตอบ')}
                            </button>
                            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        </div>
                        {/* Home Button (แบบ Link เพื่อให้สามารถจัด state ได้ก่อน) */}
                        <button
                            onClick={handleGoHome} // <--- ใช้ handleGoHome เพื่อรีเซ็ต state และนำทาง
                            className="w-full flex items-center justify-center border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            กลับหน้าหลัก
                        </button>
                        {/* ลบ Link ที่ซ้ำซ้อนและไม่ได้ใช้งานออก */}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Feedback View ---
function FeedbackView({ feedbackData, originalTitleWords, isLastQuestion, onNext, onHome }) {
    const calculatedScore = useMemo(() => {
        let score = 0;
        const { correct, clue_words_analysis, submission } = feedbackData;
        if (correct) score += 25;

        const userSelectedWordsLower = (submission.userClues || []).map(w => w.toLowerCase());
        const modelClueWordsLower = (clue_words_analysis || []).map(c => c.word.toLowerCase());

        if (modelClueWordsLower.length > 0) {
            const pointsPerClue = 75 / modelClueWordsLower.length;
            let clueScore = 0;
            userSelectedWordsLower.forEach(word => {
                if (modelClueWordsLower.includes(word)) clueScore += pointsPerClue;
                else clueScore -= pointsPerClue;
            });
            score += clueScore;
        }
        return Math.max(0, Math.round(score));
    }, [feedbackData]);

    const scoreColor = calculatedScore >= 75 ? 'text-green-500' : calculatedScore >= 50 ? 'text-yellow-500' : 'text-red-500';
    const originalUserSelectedWords = feedbackData.submission.userClues || [];
    const modelClueWordsAnalysis = feedbackData.clue_words_analysis || [];

    const userSelectedWordsLowerSet = new Set(originalUserSelectedWords.map(w => w.toLowerCase()));
    const modelClueWordsLowerSet = new Set(modelClueWordsAnalysis.map(c => c.word.toLowerCase()));
    const incorrectUserWords = originalUserSelectedWords.filter(word => !modelClueWordsLowerSet.has(word.toLowerCase()));

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 font-sans animate-fade-in">
            <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8">
                <div className={`text-center mb-6 p-4 rounded-lg ${feedbackData.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <h1 className="text-3xl font-bold">{feedbackData.correct ? 'คุณตอบถูก!' : 'คุณตอบผิด'}</h1>
                    <p className="mt-1">{feedbackData.explanation}</p>
                </div>

                <div className="text-center mb-8">
                    <p className="text-lg text-gray-600">คะแนนการวิเคราะห์ของคุณคือ</p>
                    <p className={`text-7xl font-bold ${scoreColor}`}>{calculatedScore}</p>
                </div>

                <div className="space-y-3">
                {/* หัวข้อพร้อมไอคอน */}
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <Brain className="mr-3 text-purple-500 h-6 w-6" /> {/* ไอคอนสมอง */}
                    การวิเคราะห์โดย AI
                </h2>

                {/* กล่องข้อความ AI Reasoning */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 ">
                    <p className="text-gray-700 leading-relaxed">
                    { feedbackData.ai_reasoning }
                    </p>
                </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Target className="mr-3 text-blue-500" />ผลการวิเคราะห์คำสำคัญ</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                            {modelClueWordsAnalysis.length > 0 ? (
                                <ul className="space-y-4">
                                    {modelClueWordsAnalysis.map((clue, index) => {
                                        const originalDisplayWord = originalTitleWords.find(w => w.toLowerCase() === clue.word.toLowerCase()) || clue.word;
                                        return (
                                            <li key={index} className="flex items-start">
                                                {userSelectedWordsLowerSet.has(clue.word.toLowerCase()) ?
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" title="คุณเลือกคำนี้ถูกต้อง" /> :
                                                    <XCircle className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" title="คุณพลาดคำนี้ไป" />
                                                }
                                                <div>
                                                    <p className="font-semibold text-gray-700">"{originalDisplayWord}"</p>
                                                    <p className="text-sm text-gray-500">{clue.analysis}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                    {incorrectUserWords.length > 0 && (
                                        <>
                                            <hr className="my-4" />
                                            {incorrectUserWords.map((word, index) => (
                                                <li key={`incorrect-${index}`} className="flex items-start">
                                                    <XCircle className="h-5 w-5 text-red-500 mr-3 mt-1 flex-shrink-0" title="คุณเลือกคำนี้ผิด" />
                                                    <div>
                                                        <p className="font-semibold text-gray-700 italic">"{word}"</p>
                                                        <p className="text-sm text-gray-500">คำนี้ไม่ใช่คำสำคัญตามการวิเคราะห์ของโมเดล</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                            ) : (<p className="text-gray-500">โมเดลไม่พบคำสำคัญที่ชัดเจนในข่าวนี้</p>)}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Brain className="mr-3 text-purple-500" />คำที่คุณเลือก</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-56">
                            {originalUserSelectedWords.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {originalUserSelectedWords.map(word => (
                                        <span key={word} className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">{word}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 italic">คุณไม่ได้เลือกคำสำคัญใดๆ</p>
                            )}
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

// ลบโค้ดซ้ำซ้อนในปุ่ม Home ออกจากส่วน Render หลัก