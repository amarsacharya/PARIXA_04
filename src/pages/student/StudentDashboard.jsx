import React, { useState, useEffect } from 'react';
import { Calendar, PlayCircle, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import api from '../../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [assignedExams, setAssignedExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get('/exams/my-assigned-exams');
                // Sort by time ascending
                const sorted = res.data.sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
                setAssignedExams(sorted);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExams();
    }, []);

    const upcoming = assignedExams.filter(e => e.status !== 'Completed');
    const past = assignedExams.filter(e => e.status === 'Completed');

    const startExam = (examId) => {
        navigate(`/student/exam/${examId}`);
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back! You have {upcoming.filter(e => e.status === 'Available').length} exam(s) available to take right now.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Clock className="mr-2 text-indigo-500" size={20} /> My Schedule
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {upcoming.length === 0 ? (
                                <div className="p-10 text-center text-gray-500">No upcoming exams assigned yet.</div>
                            ) : upcoming.map((exam) => (
                                <div key={exam._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="text-md font-bold text-gray-900">{exam.title}</h3>
                                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                                                <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(exam.startTime).toLocaleDateString()}</span>
                                                <span className="flex items-center"><Clock size={14} className="mr-1" /> {new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="flex items-center">Duration: {exam.durationMinutes} min</span>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {exam.status === 'Available' ? (
                                                <Button onClick={() => startExam(exam._id)} className="flex items-center bg-indigo-600 hover:bg-indigo-700 animate-pulse hover:animate-none">
                                                    <PlayCircle size={18} className="mr-2" /> Start Exam
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" disabled className="flex items-center opacity-60">
                                                    Scheduled
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {exam.status === 'Available' && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700 flex items-center gap-2">
                                            <AlertTriangle size={16} />
                                            <span>Important: Your session will be monitored for tab switching.</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-md font-medium text-gray-900 flex items-center">
                                <FileText className="mr-2 text-indigo-500" size={18} /> History
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {past.length === 0 ? (
                                <div className="p-6 text-center text-xs text-gray-400">No completed exams.</div>
                            ) : past.map((exam) => (
                                <div key={exam._id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <p className="font-bold text-gray-900 text-sm mb-1">{exam.title}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-medium">{new Date(exam.startTime).toLocaleDateString()}</span>
                                        {exam.score !== null ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-indigo-600 font-black px-2.5 py-1 bg-indigo-50 rounded-lg">
                                                    {exam.score} / {exam.totalQuestions}
                                                </span>
                                                <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter mt-1">Score Released</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 font-bold px-2.5 py-1 bg-gray-100 rounded-lg italic">
                                                {exam.showResults ? 'Processing...' : 'Finished'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 shadow-xl rounded-2xl p-6 text-white text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <CheckCircle size={80} />
                        </div>
                        <CheckCircle size={40} className="mx-auto mb-3 text-indigo-300" />
                        <h3 className="font-bold text-lg mb-1">System Health</h3>
                        <p className="text-indigo-100 text-xs opacity-90 leading-relaxed italic">"You are connected to Parixa Secure Network. All exams are monitored by AI Anti-Cheat."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
