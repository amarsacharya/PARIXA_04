import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, FileText, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/common/Modal';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [breakdownData, setBreakdownData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFetchingBreakdown, setIsFetchingBreakdown] = useState(false);

    const handleViewBreakdown = async (examId) => {
        setIsFetchingBreakdown(true);
        try {
            const res = await api.get(`/exams/${examId}/my-submission`);
            setBreakdownData(res.data);
            setIsModalOpen(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load breakdown. Make sure results are released.');
        } finally {
            setIsFetchingBreakdown(false);
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get('/exams/my-assigned-exams');
                // Only show exams that are completed
                setResults(res.data.filter(e => e.status === 'Completed'));
            } catch (err) {
                console.error("Failed to load results:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Academic Performance</h1>
                <p className="text-gray-500 font-medium">Review your secure assessment scores and performance analytics.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {results.map((result) => (
                    <div key={result._id} className="bg-white overflow-hidden shadow-sm rounded-3xl border border-gray-200 transition-all hover:shadow-xl hover:shadow-indigo-50">
                        <div className={`px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b ${result.score === null ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${result.score === null ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">{result.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> TAKEN ON: {new Date(result.startTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                {result.score !== null ? (
                                    <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-black uppercase tracking-widest rounded-xl bg-green-100 text-green-800 items-center gap-2 border border-green-200">
                                        <CheckCircle size={14} /> Result Released
                                    </span>
                                ) : (
                                    <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-black uppercase tracking-widest rounded-xl bg-amber-100 text-amber-800 items-center gap-2 border border-amber-200 animate-pulse">
                                        <AlertCircle size={14} /> Awaiting Educator Review
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-8">
                            {result.score !== null ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center flex flex-col justify-center">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Final Score</p>
                                        <p className="text-5xl font-black text-indigo-600 tracking-tighter">
                                            {result.score} <span className="text-lg text-gray-300 font-bold">/ {result.totalQuestions}</span>
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center flex flex-col justify-center">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Accuracy</p>
                                        <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                            {Math.round((result.score / result.totalQuestions) * 100)}%
                                        </p>
                                    </div>
                                    <div className="bg-indigo-900 p-6 rounded-3xl text-center flex flex-col justify-center text-white relative overflow-hidden group">
                                        <Award className="absolute -bottom-2 -right-2 text-white opacity-5 w-24 h-24 group-hover:scale-110 transition-transform" />
                                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mb-2 opacity-80">Achievement</p>
                                        <p className="text-2xl font-black flex items-center justify-center gap-2">
                                            {result.score / result.totalQuestions >= 0.8 ? 'Excellent 🏆' : 'Keep it up! 💪'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 px-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
                                    <div className="bg-gray-100 p-4 rounded-full text-gray-400">
                                        <FileText size={40} className="opacity-20 translate-y-2 translate-x-1" />
                                    </div>
                                    <p className="text-gray-500 font-bold text-sm">Results for this assessment are securely locked by the educator.</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Verification in Progress</p>
                                </div>
                            )}
                        </div>

                        {result.score !== null && (
                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => handleViewBreakdown(result._id)}
                                    disabled={isFetchingBreakdown}
                                    className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2"
                                >
                                    {isFetchingBreakdown ? 'Loading Audit...' : 'View Performance Breakdown \u2192'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {results.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Clock className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-900 font-black text-xl mb-1">No Past RecordsFound</p>
                        <p className="text-gray-400 font-medium text-sm">Once you complete an exam, your score history will appear here.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detailed Performance Audit">
                {breakdownData && (
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto p-2">
                        {breakdownData.answers.map((ans, idx) => {
                            const isCorrect = ans.selectedOption === ans.question?.correctAnswer;
                            return (
                                <div key={idx} className={`p-6 bg-white border-2 rounded-3xl transition-all ${isCorrect ? 'border-green-100' : 'border-red-100 shadow-sm shadow-red-50'}`}>
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Question {idx + 1}</span>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {isCorrect ? 'CORRECT' : 'INCORRECT'}
                                        </span>
                                    </div>
                                    <p className="text-md font-bold text-gray-900 mb-4">{ans.question?.text || "[Question Removed]"}</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className={`p-3 rounded-xl border text-sm font-medium ${isCorrect ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                            <p className="text-[9px] font-black uppercase opacity-60 mb-1">Your Answer</p>
                                            {ans.selectedOption !== undefined && ans.question?.options && ans.selectedOption >= 0 ? ans.question.options[ans.selectedOption] : "No Answer"}
                                        </div>
                                        {!isCorrect && (
                                            <div className="p-3 rounded-xl border border-gray-100 text-gray-600 text-sm font-medium bg-gray-50/50">
                                                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Correct Answer</p>
                                                {ans.question?.options ? ans.question.options[ans.question.correctAnswer] : "N/A"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StudentResults;
