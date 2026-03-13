import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from '../../components/exam/QuestionCard';
import ExamTimer from '../../components/exam/ExamTimer';
import QuestionPalette from '../../components/exam/QuestionPalette';
import WarningModal from '../../components/exam/WarningModal';
import { useExamSecurity } from '../../hooks/useExamSecurity';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [examState, setExamState] = useState('pre-start'); // pre-start, instructions, active, submitting, complete, locked
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState([]);
    const [examData, setExamData] = useState(null);

    // Hardcode mock data for demo
    useEffect(() => {
        // Simulate API fetch based on examId
        setTimeout(() => {
            setExamData({
                id: examId,
                title: "Midterm Computer Science",
                duration: 60,
                settings: { allowBack: true, strictSecurity: true }
            });
            setQuestions([
                { id: 'q1', text: 'Which data structure follows LIFO?', options: [{ id: 'opt1', text: 'Queue' }, { id: 'opt2', text: 'Stack' }, { id: 'opt3', text: 'Tree' }, { id: 'opt4', text: 'Graph' }], difficulty: 'easy', marks: 1 },
                { id: 'q2', text: 'What is the time complexity of binary search?', options: [{ id: 'opt1', text: 'O(n)' }, { id: 'opt2', text: 'O(log n)' }, { id: 'opt3', text: 'O(n^2)' }, { id: 'opt4', text: 'O(1)' }], difficulty: 'medium', marks: 2 },
                { id: 'q3', text: 'Which sorting algorithm is deemed fastest on average?', options: [{ id: 'opt1', text: 'Bubble Sort' }, { id: 'opt2', text: 'Quick Sort' }, { id: 'opt3', text: 'Selection Sort' }, { id: 'opt4', text: 'Insertion Sort' }], difficulty: 'medium', marks: 2 },
                { id: 'q4', text: 'Dijkstra algorithm is used for?', options: [{ id: 'opt1', text: 'Shortest path' }, { id: 'opt2', text: 'Sorting' }, { id: 'opt3', text: 'Minimum Spanning Tree' }, { id: 'opt4', text: 'Hashing' }], difficulty: 'hard', marks: 3 },
                { id: 'q5', text: 'What does CSS stand for?', options: [{ id: 'opt1', text: 'Colorful Style Sheets' }, { id: 'opt2', text: 'Cascading Style Sheets' }, { id: 'opt3', text: 'Computer Style Sheets' }, { id: 'opt4', text: 'Creative Style Sheets' }], difficulty: 'easy', marks: 1 },
            ]);
            setLoading(false);
        }, 1000);
    }, [examId]);

    // Exam Security Hook Integration
    const handleLockout = () => {
        autoSubmit('Security Violation Limit Reached. Exam Locked.');
    };

    const {
        violationCount,
        isWarningVisible,
        isLocked,
        dismissWarning,
        requestFullscreen
    } = useExamSecurity(handleLockout);

    // Sync lockout state to UI state
    useEffect(() => {
        if (isLocked && examState === 'active') {
            setExamState('locked');
        }
    }, [isLocked, examState]);

    // Handlers
    const handleStart = async () => {
        // Attempt fullscreen before starting
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (e) {
            console.warn("Fullscreen request failed, proceeding anyway", e);
        }
        setExamState('active');
    };

    const handleOptionSelect = (qId, optId) => {
        setAnswers(prev => ({ ...prev, [qId]: optId }));
    };

    const handleMarkReview = () => {
        const qId = questions[currentIndex].id;
        if (markedForReview.includes(qId)) {
            setMarkedForReview(prev => prev.filter(id => id !== qId));
        } else {
            setMarkedForReview(prev => [...prev, qId]);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Reached the end, show summary/confirm submit modal
            if (window.confirm("You have reached the end of the exam. Do you want to submit?")) {
                autoSubmit('Completed');
            }
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handlePaletteSelect = (index) => {
        setCurrentIndex(index);
    };

    const autoSubmit = (reason) => {
        setExamState('submitting');
        console.log("Submitting due to:", reason);

        // Process answers, send to API along with violations
        const payload = {
            examId,
            answers,
            violations: violationCount,
            submitReason: reason,
            timestamp: new Date().toISOString()
        };

        // Simulate API delay
        setTimeout(() => {
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.log(err));
            }
            setExamState('complete');
        }, 2000);
    };

    // Render Logic
    if (loading) return <Loader filled size="lg" />;
    if (!examData) return <div className="p-8 text-center text-red-500">Failed to load exam.</div>;

    if (examState === 'pre-start') {
        return (
            <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{examData.title}</h1>
                <p className="text-gray-600 mb-8">{examData.duration} Minutes • {questions.length} Questions</p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left mb-8 shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-md font-bold text-yellow-800">Exam Rules & Security</h3>
                            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                                <li>This exam is strictly proctored. You must remain in Fullscreen mode.</li>
                                <li>Closing the tab, switching windows, or exiting fullscreen will trigger a violation.</li>
                                <li><b>Maximum 2 violations</b> are allowed. Upon the second violation, your exam is auto-submitted.</li>
                                <li>Copy, paste, and right-click have been disabled.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Button onClick={handleStart} size="lg" className="px-12 py-4 text-lg">
                    I Understand, Start Exam Now
                </Button>
            </div>
        );
    }

    if (examState === 'submitting') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader size="xl" />
                <h2 className="mt-6 text-2xl font-bold text-gray-800">Submitting Exam...</h2>
                <p className="text-gray-500 mt-2">Please do not close the browser or click back.</p>
            </div>
        );
    }

    if (examState === 'complete') {
        return (
            <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Submitted Successfully!</h2>
                <p className="text-gray-600 mb-8">Your answers have been securely saved.</p>
                <Button onClick={() => navigate('/student/dashboard')} fullWidth>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    if (examState === 'locked') {
        return (
            <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md border border-red-200 text-center bg-red-50">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-2">Exam Terminated</h2>
                <p className="text-red-700 mb-8 font-medium bg-red-100 p-3 rounded">Maximum security violations exceeded.</p>
                <p className="text-gray-600 mt-2 text-sm mb-6">Your answers up to this point have been submitted automatically. This incident will be reported to your instructor.</p>
                <Button variant="danger" onClick={() => navigate('/student/dashboard')} fullWidth>
                    Exit to Dashboard
                </Button>
            </div>
        );
    }

    // ACTIVE EXAM RENDER
    return (
        <div className="h-[calc(100vh-4rem)] -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 bg-gray-100 overflow-hidden flex flex-col pt-6 pb-4">

            {/* Top Bar fixed within container */}
            <div className="px-6 py-3 bg-white shadow-sm flex items-center justify-between z-10 mx-4 sm:mx-8 rounded-lg mb-4">
                <h2 className="font-bold text-lg text-gray-800 truncate pr-4">{examData.title}</h2>
                <div className="flex items-center gap-4">
                    {violationCount > 0 && (
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-full flex items-center animate-pulse">
                            <ShieldAlert size={14} className="mr-1" /> Violation: {violationCount}/2
                        </span>
                    )}
                    <ExamTimer
                        durationMinutes={examData.duration}
                        onTimeUp={() => autoSubmit('Time Expired')}
                    />
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => window.confirm('Are you sure you want to end test early?') && autoSubmit('Manual Early Submit')}
                    >
                        End Test
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 sm:px-8 overflow-hidden">

                {/* Question Area */}
                <div className="flex-1 w-full lg:w-3/4 overflow-y-auto">
                    {questions[currentIndex] && (
                        <QuestionCard
                            question={questions[currentIndex]}
                            currentIndex={currentIndex}
                            totalQuestions={questions.length}
                            selectedOption={answers[questions[currentIndex].id]}
                            onOptionSelect={handleOptionSelect}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            onMarkReview={handleMarkReview}
                            isMarked={markedForReview.includes(questions[currentIndex].id)}
                        />
                    )}
                </div>

                {/* Sidebar / Palette */}
                <div className="w-full lg:w-1/4 flex-shrink-0 flex flex-col max-h-64 lg:max-h-full">
                    <QuestionPalette
                        questions={questions}
                        currentIndex={currentIndex}
                        answers={answers}
                        markedForReview={markedForReview}
                        onSelectQuestion={handlePaletteSelect}
                    />
                </div>
            </div>

            <WarningModal
                isOpen={isWarningVisible && !isLocked}
                onAcknowledge={dismissWarning}
                violationCount={violationCount}
            />
        </div>
    );
};

export default ExamPage;
