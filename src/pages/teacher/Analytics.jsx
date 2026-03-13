import React from 'react';
import ScoreChart from '../../components/analytics/ScoreChart';
import DifficultyChart from '../../components/analytics/DifficultyChart';
import PerformanceChart from '../../components/analytics/PerformanceChart';

const Analytics = () => {
    // Mock Data
    const scoreData = [
        { name: 'Midterm', score: 85, average: 75 },
        { name: 'DS Quiz', score: 72, average: 68 },
        { name: 'Algos Final', score: 90, average: 78 },
    ];

    const difficultyPerformance = [
        { name: 'Easy Correct', value: 85, color: '#10B981' },
        { name: 'Medium Correct', value: 65, color: '#F59E0B' },
        { name: 'Hard Correct', value: 40, color: '#EF4444' }
    ];

    const classPerformanceTrend = [
        { date: 'Sep 1', score: 65 },
        { date: 'Sep 15', score: 68 },
        { date: 'Oct 1', score: 72 },
        { date: 'Oct 15', score: 75 },
        { date: 'Nov 1', score: 71 },
        { date: 'Nov 15', score: 82 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Class Analytics & Reporting</h1>
            </div>

            <div className="flex gap-4 mb-6">
                <select className="block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>All Classes / Sections</option>
                    <option>Computer Science Year 3</option>
                    <option>Data Science Year 2</option>
                </select>
                <select className="block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option>Overall Trends</option>
                    <option>Midterm Exam</option>
                    <option>Final Exam</option>
                </select>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white px-4 py-5 shadow-sm rounded-lg border border-gray-200 overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Class Score</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 border-l-4 border-indigo-500 pl-4">76.4%</dd>
                    <dd className="mt-2 text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        +4.2% from last month
                    </dd>
                </div>
                <div className="bg-white px-4 py-5 shadow-sm rounded-lg border border-gray-200 overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Pass Rate</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 border-l-4 border-green-500 pl-4">89.2%</dd>
                    <dd className="mt-2 text-sm text-gray-500">102 out of 115 students passed</dd>
                </div>
                <div className="bg-white px-4 py-5 shadow-sm rounded-lg border border-gray-200 overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Flagged Cheating Attempts</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 border-l-4 border-red-500 pl-4">3</dd>
                    <dd className="mt-2 text-sm text-red-600">Requires manual review</dd>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceChart data={classPerformanceTrend} title="Class Performance Trend over Semester" />
                </div>
                <div>
                    <ScoreChart data={scoreData} title="Recent Exam Averages vs Top Scores" />
                </div>
                <div>
                    <DifficultyChart data={difficultyPerformance} title="Success Rate by Question Difficulty" />
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Topic Weaknesses (AI Insights)</h3>
                <p className="text-sm text-gray-600 mb-6">The system identified the following topics where students consistently score below 60%. Consider revising these topics in upcoming lectures.</p>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                        <div>
                            <p className="font-semibold text-red-800">Dynamic Programming Algorithms</p>
                            <p className="text-sm text-red-600">42% average accuracy • Appeared in 2 exams</p>
                        </div>
                        <button className="text-indigo-600 text-sm font-medium hover:underline">Generate Practice Quiz</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <div>
                            <p className="font-semibold text-orange-800">Binary Tree Traversals</p>
                            <p className="text-sm text-orange-600">55% average accuracy • Appeared in 3 exams</p>
                        </div>
                        <button className="text-indigo-600 text-sm font-medium hover:underline">Generate Practice Quiz</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
