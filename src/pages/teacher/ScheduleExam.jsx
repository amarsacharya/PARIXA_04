import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ChevronDown, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';

const ScheduleExam = () => {
    const navigate = useNavigate();
    
    // Data states
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);
    
    const [showResults, setShowResults] = useState(false);
    const [examPassword, setExamPassword] = useState('');
    
    // Form states
    const [selectedExamId, setSelectedExamId] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [selectedStudents, setSelectedStudents] = useState([]);
    
    const [scheduleData, setScheduleData] = useState({
        date: '',
        startTime: '',
        durationMinutes: 60,
        windowMinutes: 60,
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [examsRes, studentsRes] = await Promise.all([
                    api.get('/exams/my-exams'),
                    api.get('/exams/students')
                ]);
                setExams(examsRes.data);
                setStudents(studentsRes.data);
            } catch (err) {
                console.error("Failed to load scheduling data", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const selectedExam = exams.find(e => e._id === selectedExamId);

    const availableClasses = [...new Set(students.map(s => s.assignedClass || 'Unassigned'))].sort();

    const filteredStudents = students.filter(s => {
        const matchText = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase());
        const matchClass = classFilter === 'all' ? true : (s.assignedClass || 'Unassigned') === classFilter;
        return matchText && matchClass;
    });

    const toggleStudent = (sid) => {
        setSelectedStudents(prev => 
            prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
        );
    };

    const handleSelectAll = (checked) => {
        const filteredIds = filteredStudents.map(s => s._id);
        if (checked) {
            setSelectedStudents([...new Set([...selectedStudents, ...filteredIds])]);
        } else {
            setSelectedStudents(selectedStudents.filter(id => !filteredIds.includes(id)));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExamId) return alert('Select an exam first.');
        if (selectedStudents.length === 0) return alert('At least 1 student must be assigned.');

        setIsScheduling(true);
        try {
            await api.post(`/exams/${selectedExamId}/schedule`, {
                date: scheduleData.date,
                startTime: scheduleData.startTime,
                durationMinutes: scheduleData.durationMinutes,
                entryWindowMinutes: scheduleData.windowMinutes,
                studentIds: selectedStudents,
                showResults,
                examPassword
            });
            alert('Exam Successfully Scheduled and Question Sets Distributed!');
            navigate('/teacher/dashboard');
        } catch (error) {
            console.error('Scheduling error:', error);
            alert('Failed to schedule exam. Ensure all fields are valid.');
        } finally {
            setIsScheduling(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Schedule Exam</h1>
                    <p className="text-gray-500 font-medium">Configure timing and distribute sets to your students.</p>
                </div>
                <div className="flex gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                    <Users size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-700">{selectedStudents.length} Students Selected</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Assignment & Exam Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        <section>
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Step 1: Choose Exam</label>
                            <div className="relative group">
                                <select 
                                    value={selectedExamId}
                                    onChange={(e) => setSelectedExamId(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                >
                                    <option value="">Select a saved exam shell...</option>
                                    {exams.map(ex => (
                                        <option key={ex._id} value={ex._id}>{ex.title} ({ex.subject})</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 pointer-events-none transition-colors" size={20} />
                            </div>
                            {selectedExam && (
                                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3 animate-in slide-in-from-top-2">
                                    <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="text-green-700" size={18} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-green-900">Exam Ready</p>
                                        <p className="text-xs text-green-700">Questions have been generated and saved for this shell.</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Step 2: Assign Students</label>
                                <button 
                                    onClick={() => {
                                        const filteredIds = filteredStudents.map(s => s._id);
                                        const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedStudents.includes(id));
                                        handleSelectAll(!allFilteredSelected);
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    {filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.includes(s._id)) 
                                        ? 'Deselect Shown' : 'Select All Shown'}
                                </button>
                            </div>
                            
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <select 
                                    value={classFilter} 
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-bold text-gray-700 focus:outline-none max-w-[150px] shadow-sm"
                                >
                                    <option value="all">All Classes</option>
                                    {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="border border-gray-100 rounded-xl overflow-hidden max-h-72 overflow-y-auto bg-gray-100/50">
                                {filteredStudents.map(student => (
                                    <div 
                                        key={student._id}
                                        onClick={() => toggleStudent(student._id)}
                                        className={`flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                            selectedStudents.includes(student._id) ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                                selectedStudents.includes(student._id) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                                                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider">
                                                        {student.assignedClass || 'Unassigned'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                        {selectedStudents.includes(student._id) && (
                                            <CheckCircle className="text-indigo-600" size={18} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right Panel: Timing Config */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                        <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider">Step 3: Schedule</label>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                            <Input
                                label="Execution Date"
                                type="date"
                                required
                                value={scheduleData.date}
                                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                                icon={<CalendarIcon size={18} />}
                            />

                            <Input
                                label="Start Time"
                                type="time"
                                required
                                value={scheduleData.startTime}
                                onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                                icon={<Clock size={18} />}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Duration (Min)"
                                    type="number"
                                    min="1"
                                    required
                                    value={scheduleData.durationMinutes}
                                    onChange={(e) => setScheduleData({ ...scheduleData, durationMinutes: e.target.value })}
                                />
                                <Input
                                    label="Entry Window (Min)"
                                    type="number"
                                    min="1"
                                    required
                                    value={scheduleData.windowMinutes || 60}
                                    onChange={(e) => setScheduleData({ ...scheduleData, windowMinutes: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium px-1">How long the 'gate' stays open for students to join. Once they enter, they get the full {scheduleData.durationMinutes} mins.</p>

                            {/* Show Results Choice */}
                            {/* Show Results Choice and Exam Password */}
                            <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Show Marks Instantly?</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Allow students to see score after submission</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setShowResults(!showResults)}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${showResults ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${showResults ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <Users size={16} className="text-indigo-600" />
                                        Exam Access PIN (Optional)
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 123456 or PARIXA2026"
                                        value={examPassword}
                                        onChange={(e) => setExamPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all outline-none placeholder:text-gray-300"
                                    />
                                    <p className="text-[10px] text-gray-400 font-medium">If set, students must enter this password before they can start the exam.</p>
                                </div>
                            </div>

                            <div className="pt-6 mt-auto">
                                <Button 
                                    fullWidth 
                                    size="lg" 
                                    type="submit" 
                                    isLoading={isScheduling}
                                    disabled={!selectedExamId || selectedStudents.length === 0}
                                    className={`${(!selectedExamId || selectedStudents.length === 0) ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}
                                >
                                    Confirm & Schedule
                                </Button>
                                <p className="text-center text-[10px] text-gray-400 mt-3 font-medium px-4">
                                    Sets will be distributed automatically among {selectedStudents.length} students upon confirmation.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleExam;
