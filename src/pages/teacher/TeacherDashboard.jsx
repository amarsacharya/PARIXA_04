import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, CheckCircle, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const TeacherDashboard = () => {
    const [exams, setExams] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [exRes, subRes] = await Promise.all([
                    api.get('/exams/my-exams'),
                    api.get('/exams/recent-submissions')
                ]);
                setExams(exRes.data);
                setSubmissions(subRes.data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    const stats = [
        { name: 'Total Exams Created', value: exams.length, icon: BookOpen, color: 'bg-indigo-500' },
        { name: 'Active Assignments', value: exams.filter(e => e.status === 'published').length, icon: Clock, color: 'bg-yellow-500' },
        { name: 'Recent Submissions', value: submissions.length, icon: FileText, color: 'bg-blue-500' },
        { name: 'Avg Performance', value: submissions.length > 0 ? `${(submissions.reduce((a,b) => a+(b.score/b.totalQuestions), 0) / submissions.length * 100).toFixed(0)}%` : 'N/A', icon: CheckCircle, color: 'bg-green-500' },
    ];

    if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <div className="flex gap-2">
                    <Link to="/teacher/exam/create" className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 text-sm font-medium transition-colors shadow-sm">
                        Create Exam
                    </Link>
                    <Link to="/teacher/exam/schedule" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors shadow-md">
                        Schedule Exam
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-6 flex items-center">
                        <div className={`p-3 rounded-lg ${item.color} text-white`}>
                            <item.icon size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</p>
                            <p className="text-2xl font-black text-gray-900">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-8 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">AI Question Lab</h2>
                    <div className="space-y-6 text-left">
                        <Link to="/teacher/upload-pdf" className="flex items-start group">
                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <FileText size={20} />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-md font-bold text-gray-900 group-hover:text-blue-600">PDF Intelligent Extraction</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Turn your PDF stacks into interactive MCQ sets using ParixaAI Vision.</p>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" size={20} />
                        </Link>

                        <Link to="/teacher/generate-syllabus" className="flex items-start group pt-6 border-t border-gray-100">
                            <div className="bg-purple-100 p-3 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <BookOpen size={20} />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-md font-bold text-gray-900 group-hover:text-purple-600">Syllabus-to-Exam</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Generate context-aware questions from any text input instantly.</p>
                            </div>
                            <ArrowRight className="text-gray-300 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all" size={20} />
                        </Link>
                    </div>
                </div>

                {/* Recent Submissions List */}
                <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                        <Link to="/teacher/results" className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">View Details</Link>
                    </div>
                    {submissions.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-gray-400 italic">
                            No submissions recorded yet.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {submissions.map((sub) => (
                                <li key={sub._id} className="px-8 py-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 p-2 rounded-lg text-gray-400"><User size={20} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{sub.student?.name || 'Unknown Student'}</p>
                                                <p className="text-xs text-gray-500">{sub.exam?.title || 'Exam'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-md font-black text-indigo-600">{sub.score}/{sub.totalQuestions}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

