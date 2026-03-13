import React, { useState } from 'react';
import { Search, Download, CheckCircle, Clock } from 'lucide-react';
import Button from '../../components/common/Button';

const Results = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Exam Data
    const exams = [
        { id: 1, title: 'Midterm Computer Science', date: '2023-11-15', totalStudents: 45, submitted: 45, status: 'Graded', avgScore: 82 },
        { id: 2, title: 'Data Structures Quiz', date: '2023-11-10', totalStudents: 42, submitted: 40, status: 'Grading', avgScore: null },
        { id: 3, title: 'Algorithms Final', date: '2023-10-25', totalStudents: 44, submitted: 44, status: 'Published', avgScore: 78 },
    ];

    // Mock Student Results for selected exam (Assume Midterm is selected)
    const studentResults = [
        { id: 1, name: 'Alice Smith', rollNo: 'CS101', score: 92, total: 100, status: 'Pass', violations: 0 },
        { id: 2, name: 'Bob Jones', rollNo: 'CS102', score: 75, total: 100, status: 'Pass', violations: 1 },
        { id: 3, name: 'Charlie Brown', rollNo: 'CS103', score: 45, total: 100, status: 'Fail', violations: 0 },
        { id: 4, name: 'David Wilson', rollNo: 'CS104', score: 0, total: 100, status: 'Disqualified', violations: 2 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Select Exam</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {exams.map((exam) => (
                                <tr key={exam.id} className={exam.id === 1 ? "bg-indigo-50 border-l-4 border-indigo-500" : "hover:bg-gray-50"}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.submitted} / {exam.totalStudents}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.avgScore ? `${exam.avgScore}%` : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.status === 'Published' ? 'bg-green-100 text-green-800' :
                                                exam.status === 'Graded' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900">View Selected</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Results for Selected Exam */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-medium text-gray-900">Student Scores: <span className="text-indigo-600">Midterm Computer Science</span></h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search student or roll no..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="secondary" className="flex items-center">
                            <Download size={16} className="mr-2" /> Export
                        </Button>
                        <Button className="flex items-center bg-green-600 hover:bg-green-700">
                            <CheckCircle size={16} className="mr-2" /> Publish Results
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security Violations</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentResults.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {student.score} / {student.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'Pass' ? 'bg-green-100 text-green-800' :
                                                student.status === 'Fail' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {student.violations > 0 ? (
                                            <span className="text-red-600 font-medium flex items-center">
                                                {student.violations} <span className="text-xs text-gray-500 ml-1">warnings</span>
                                            </span>
                                        ) : (
                                            <span className="text-green-600 font-medium">Clean</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900">Review Answers</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
