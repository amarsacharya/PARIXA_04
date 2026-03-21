import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Clock, Eye, AlertTriangle, User, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';

const Results = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [activeModalTab, setActiveModalTab] = useState('integrity');

    useEffect(() => {
        const loadExams = async () => {
            try {
                const res = await api.get('/exams/my-exams');
                setExams(res.data);
                if (res.data && res.data.length > 0) {
                    handleSelectExam(res.data[0]._id);
                }
            } catch (err) {
                console.error("Failed to load exams", err);
            } finally {
                setLoading(false);
            }
        };
        loadExams();
    }, []);

    const handleSelectExam = async (examId) => {
        setSelectedExamId(examId);
        try {
            const res = await api.get(`/exams/${examId}/submissions`);
            setSubmissions(res.data);
        } catch (err) {
            console.error("Failed to load submissions", err);
        }
    };

    const handlePublish = async (examId) => {
        try {
            await api.post(`/exams/${examId}/publish-results`);
            alert("Results published to all students!");
            setExams(prev => prev.map(e => e._id === examId ? { ...e, showResults: true } : e));
        } catch (err) {
            alert("Failed to publish results.");
        }
    };

    const handleExportCSV = () => {
        if (submissions.length === 0) return alert("No submissions to export!");
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Student Name,Email,Score,Total Questions,Percentage,AI Integrity Logs\n";
        
        submissions.forEach(sub => {
            const logs = sub.proctoringLogs?.map(log => log.violation).join(" | ") || "CLEAN";
            csvContent += `"${sub.student?.name}","${sub.student?.email}",${sub.score},${sub.totalQuestions},${((sub.score/sub.totalQuestions)*100).toFixed(2)}%,"${logs}"\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Results_${currentExam?.title.split(' ').join('_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    const currentExam = exams.find(e => e._id === selectedExamId);
    const availableClasses = [...new Set(submissions.map(s => s.student?.assignedClass || 'Unassigned'))].sort();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <header>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Exam Intelligence</h1>
                <p className="text-gray-500 font-medium">Review scores, verify integrity, and publish graded results.</p>
            </header>

            {/* Exam Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <div 
                        key={exam._id} 
                        onClick={() => handleSelectExam(exam._id)}
                        className={`cursor-pointer p-6 rounded-3xl border-2 transition-all group ${
                            selectedExamId === exam._id 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' 
                            : 'bg-white border-gray-100 hover:border-indigo-300'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-xl ${selectedExamId === exam._id ? 'bg-indigo-500' : 'bg-gray-100 group-hover:bg-indigo-50'}`}>
                                <CheckCircle size={20} className={selectedExamId === exam._id ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                exam.showResults ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {exam.showResults ? 'Results Published' : 'Hidden'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold leading-none mb-1">{exam.title}</h3>
                        <div className="flex items-center gap-2">
                            <p className={`text-xs font-medium ${selectedExamId === exam._id ? 'text-indigo-100' : 'text-gray-500'}`}>
                                {new Date(exam.startTime).toLocaleDateString()} • {exam.subject}
                            </p>
                            {exam.examPassword && (
                                <div className={`p-1 rounded-md ${selectedExamId === exam._id ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Lock size={10} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submissions Table Area */}
            {selectedExamId && (
                <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="px-8 py-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-gray-50/30">
                        <div className="text-left w-full lg:w-auto">
                            <h2 className="text-xl font-black text-gray-900 leading-none">Submission Details</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{currentExam?.title}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div className="flex gap-2 w-full lg:w-auto">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search by student name..."
                                        className="w-full lg:w-48 pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select 
                                    value={classFilter} 
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 outline-none max-w-[150px]"
                                >
                                    <option value="all">All Classes</option>
                                    {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Button 
                                onClick={handleExportCSV}
                                variant="secondary"
                                className="flex items-center gap-2 rounded-2xl px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                            >
                                <Download size={18} /> Export Report (CSV)
                            </Button>
                            <Button 
                                onClick={() => handlePublish(selectedExamId)}
                                disabled={currentExam?.showResults}
                                className={`flex items-center gap-2 rounded-2xl px-6 ${currentExam?.showResults ? 'bg-gray-200 text-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100'}`}
                            >
                                <Eye size={18} /> {currentExam?.showResults ? 'Published' : 'Publish Results'}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        {submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                                <Clock size={48} className="mb-4 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-xs">Waiting for Submissions...</p>
                                <p className="text-xs mt-1">No responses have been recorded for this scheduled time yet.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-50">
                                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Student</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Performance</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">AI Integrity Log</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {submissions
                                        .filter(s => {
                                            const matchSearch = s.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true;
                                            const matchClass = classFilter === 'all' ? true : (s.student?.assignedClass || 'Unassigned') === classFilter;
                                            return matchSearch && matchClass;
                                        })
                                        .map((sub) => {
                                            const totalViolations = sub.proctoringLogs?.length || 0;
                                            return (
                                            <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4 text-left">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                                                            {sub.student?.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-bold text-gray-900">{sub.student?.name}</p>
                                                                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider">
                                                                    {sub.student?.assignedClass || 'Unassigned'}
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 font-medium">{sub.student?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-lg font-black text-gray-900 leading-none">{sub.score} <span className="text-xs text-gray-300 font-medium">/ {sub.totalQuestions}</span></span>
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mt-1">{((sub.score / sub.totalQuestions) * 100).toFixed(0)}% Score</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {sub.proctoringLogs && sub.proctoringLogs.length > 0 ? (
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-lg inline-flex self-start">
                                                                <AlertTriangle size={14} className="animate-pulse" />
                                                                <span className="text-[10px] font-bold uppercase tracking-tight">{sub.proctoringLogs.length} Security Flags Captured</span>
                                                            </div>
                                                            <ul className="text-[9px] text-gray-500 space-y-1 font-medium pl-2">
                                                                {[...new Set(sub.proctoringLogs.map(log => log.violation))].map((v, i) => (
                                                                    <li key={i} className="flex items-center gap-1">• {v}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                                                            <CheckCircle size={14} /> AI Verified Clean
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedSubmission(sub);
                                                            setActiveModalTab('integrity');
                                                        }}
                                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-white border border-indigo-100 px-4 py-2 rounded-xl hover:shadow-sm transition-all"
                                                    >
                                                        Review Integrity
                                                    </button>
                                                </td>
                                            </tr>
                );
            })}
        </tbody>
    </table>
)}
</div>
</div>
)}

{/* Review Modal */}
{selectedSubmission && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Student Success Inspector</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Verification for {selectedSubmission.student?.name}</p>
            </div>
            <button 
                onClick={() => setSelectedSubmission(null)}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-md transition-all"
            >
                <Lock size={20} />
            </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-10 flex gap-8 border-b border-gray-50">
            <button 
                onClick={() => setActiveModalTab('integrity')}
                className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeModalTab === 'integrity' ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-transparent'}`}
            >
                AI Security Audit
            </button>
            <button 
                onClick={() => setActiveModalTab('performance')}
                className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeModalTab === 'performance' ? 'text-green-600 border-green-600' : 'text-gray-400 border-transparent'}`}
            >
                Question Breakdown
            </button>
        </div>
        
        <div className="p-10 max-h-[60vh] overflow-y-auto space-y-8 bg-gray-50/20">
            {activeModalTab === 'integrity' ? (
                <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session Result</p>
                            <p className="text-2xl font-black text-gray-900">{selectedSubmission.score} / {selectedSubmission.totalQuestions}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border ${selectedSubmission.proctoringLogs?.length > 0 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">AI Audit</p>
                            <p className="text-2xl font-black">{selectedSubmission.proctoringLogs?.length || 0} Flags</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Chronological AI Snapshot Log</h4>
                        {(!selectedSubmission.proctoringLogs || selectedSubmission.proctoringLogs.length === 0) ? (
                            <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 italic text-sm">
                                No security violations were detected during this session.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedSubmission.proctoringLogs.map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl group hover:border-red-200 transition-all">
                                        <div className="bg-red-50 p-3 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{log.violation}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Logged at {new Date(log.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Detailed Submission Review</h4>
                    <div className="space-y-4">
                        {selectedSubmission.answers.map((ans, idx) => {
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
                                            <p className="text-[9px] font-black uppercase opacity-60 mb-1">Student Answer</p>
                                            {ans.selectedOption !== undefined && ans.question?.options ? ans.question.options[ans.selectedOption] : "No Answer"}
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
                </div>
            )}
        </div>

        <div className="p-10 bg-gray-50/50 border-t border-gray-50">
            <Button fullWidth onClick={() => setSelectedSubmission(null)} className="h-14 font-black text-lg rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform">
                Close Review Session
            </Button>
        </div>
    </div>
</div>
            )}
        </div>
    );
};

export default Results;
