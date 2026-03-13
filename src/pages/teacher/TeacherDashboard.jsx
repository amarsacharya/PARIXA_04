import React from 'react';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const stats = [
        { name: 'Total Exams Created', value: '12', icon: BookOpen, color: 'bg-indigo-500' },
        { name: 'Upcoming Exams', value: '3', icon: Clock, color: 'bg-yellow-500' },
        { name: 'Results Pending', value: '2', icon: FileText, color: 'bg-red-500' },
        { name: 'Results Published', value: '15', icon: CheckCircle, color: 'bg-green-500' },
    ];

    const recentExams = [
        { id: 1, title: 'Midterm Computer Science', date: '2023-11-15', studentsCount: 45, status: 'Upcoming' },
        { id: 2, title: 'Data Structures Quiz', date: '2023-11-10', studentsCount: 42, status: 'Grading' },
        { id: 3, title: 'Algorithms Final', date: '2023-10-25', studentsCount: 44, status: 'Published' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <div className="flex gap-2">
                    <Link to="/teacher/exam/create" className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 text-sm font-medium transition-colors">
                        Create Exam
                    </Link>
                    <Link to="/teacher/exam/schedule" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors">
                        Schedule Exam
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`p-3 rounded-md ${item.color} text-white`}>
                                        <item.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">AI Question Generation</h2>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                                    1
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-md font-medium text-gray-900">From PDF Upload</h3>
                                <p className="mt-1 text-sm text-gray-500">Extract questions automatically from existing PDF question papers using OCR.</p>
                                <Link to="/teacher/upload-pdf" className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium">Upload PDF &rarr;</Link>
                            </div>
                        </div>

                        <div className="flex items-start pt-4 border-t border-gray-100">
                            <div className="flex-shrink-0 mt-1">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                                    2
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-md font-medium text-gray-900">From Syllabus Topic</h3>
                                <p className="mt-1 text-sm text-gray-500">Generate fresh new Multiple Choice Questions by pasting your syllabus text.</p>
                                <Link to="/teacher/generate-syllabus" className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium">Generate Questions &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Exams List */}
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Recent Exams</h2>
                        <Link to="/teacher/results" className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">View All</Link>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {recentExams.map((exam) => (
                            <li key={exam.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 truncate">{exam.title}</p>
                                        <p className="text-sm text-gray-500">{exam.date} • {exam.studentsCount} Students</p>
                                    </div>
                                    <div>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                                                exam.status === 'Published' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {exam.status}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
