import React, { useState } from 'react';
import { Calendar, PlayCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const StudentDashboard = () => {
    const navigate = useNavigate();

    const upcomingExams = [
        { id: 1, title: 'Midterm Computer Science', date: '2023-11-15', time: '10:00 AM', duration: '60 min', status: 'Available' },
        { id: 2, title: 'Software Engineering Ethics', date: '2023-11-18', time: '02:00 PM', duration: '45 min', status: 'Upcoming' },
    ];

    const pastExams = [
        { id: 3, title: 'Data Structures Quiz', date: '2023-11-10', score: null, status: 'Grading' },
        { id: 4, title: 'Algorithms Final', date: '2023-10-25', score: '88/100', status: 'Published' },
    ];

    const startExam = (examId) => {
        // In a real app, you might have a confirmation modal here
        navigate(`/student/exam/${examId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! You have 1 exam available to take right now.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Upcoming & Actionable) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Clock className="mr-2 text-indigo-500" size={20} /> My Schedule
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {upcomingExams.map((exam) => (
                                <div key={exam.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="text-md font-bold text-gray-900">{exam.title}</h3>
                                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                                                <span className="flex items-center"><Calendar size={14} className="mr-1" /> {exam.date}</span>
                                                <span className="flex items-center"><Clock size={14} className="mr-1" /> {exam.time}</span>
                                                <span className="flex items-center">Wait limit: {exam.duration}</span>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {exam.status === 'Available' ? (
                                                <Button onClick={() => startExam(exam.id)} className="flex items-center animate-pulse hover:animate-none">
                                                    <PlayCircle size={18} className="mr-2" /> Start Exam
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" disabled className="flex items-center">
                                                    Starts Soon
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {exam.status === 'Available' && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-sm text-red-700 flex items-start">
                                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                            Important: Exam security is enabled. Do not exit fullscreen or switch tabs during the exam.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Past results & Summary) */}
                <div className="space-y-6">
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-md font-medium text-gray-900 flex items-center">
                                <FileText className="mr-2 text-indigo-500" size={18} /> Recent Results
                            </h2>
                            <Link to="/student/results" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {pastExams.map((exam) => (
                                <div key={exam.id} className="p-5">
                                    <p className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{exam.title}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 text-xs">{exam.date}</span>

                                        {exam.status === 'Published' ? (
                                            <span className="font-bold text-green-600">{exam.score}</span>
                                        ) : (
                                            <span className="text-yellow-600 text-xs font-medium px-2 py-0.5 bg-yellow-50 rounded-full border border-yellow-100">Grading</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm rounded-lg border border-transparent p-6 text-white text-center">
                        <CheckCircle size={40} className="mx-auto mb-3 text-indigo-200" />
                        <h3 className="font-bold text-lg mb-1">System Check Passed</h3>
                        <p className="text-indigo-100 text-sm opacity-90">Your browser and network are optimized for secure examination.</p>
                        <button className="mt-4 px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-full text-sm font-medium transition-colors shadow-sm">
                            Run Test Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
