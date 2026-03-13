import React from 'react';
import { Award, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentResults = () => {
    // Mock Results Data
    const results = [
        {
            id: 1,
            examTitle: 'Algorithms Final',
            dateTaken: '2023-10-25',
            score: 88,
            totalScore: 100,
            percentage: 88,
            status: 'Pass',
            classAverage: 78,
            rank: 5,
            totalStudents: 44
        },
        {
            id: 2,
            examTitle: 'Midterm Computer Science',
            dateTaken: '2023-11-15',
            score: null,
            totalScore: 100,
            percentage: null,
            status: 'Grading',
            classAverage: null,
            rank: null,
            totalStudents: 45
        }
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Exam Results</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {results.map((result) => (
                    <div key={result.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                        <div className={`px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b ${result.status === 'Grading' ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center">
                                <FileText className={`h-6 w-6 mr-3 ${result.status === 'Grading' ? 'text-yellow-500' : 'text-indigo-500'}`} />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{result.examTitle}</h3>
                                    <p className="text-sm text-gray-500">Taken on: {result.dateTaken}</p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                {result.status === 'Pass' ? (
                                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 items-center">
                                        <CheckCircle size={16} className="mr-1" /> Passed
                                    </span>
                                ) : result.status === 'Fail' ? (
                                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800 items-center">
                                        <XCircle size={16} className="mr-1" /> Failed
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        Grading in Progress
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {result.status !== 'Grading' ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 font-medium mb-1">Your Score</p>
                                        <p className="text-3xl font-bold text-indigo-600">{result.score} <span className="text-lg text-gray-400 font-normal">/ {result.totalScore}</span></p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 font-medium mb-1">Percentage</p>
                                        <p className="text-3xl font-bold text-gray-900">{result.percentage}%</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-500 font-medium mb-1">Class Average</p>
                                        <p className="text-3xl font-bold text-gray-600">{result.classAverage}%</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col justify-center items-center">
                                        <p className="text-sm text-gray-500 font-medium mb-1">Class Rank</p>
                                        <p className="text-2xl font-bold text-yellow-500 flex items-center justify-center">
                                            <Award className="mr-1" /> #{result.rank}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">out of {result.totalStudents}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500 italic">
                                    Results for this exam have not been published by the instructor yet.
                                </div>
                            )}
                        </div>

                        {result.status !== 'Grading' && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                                <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    View Detailed Answer Report &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                ))}

                {results.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No past exam results found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentResults;
