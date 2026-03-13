import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ScheduleExam = () => {
    const [scheduleData, setScheduleData] = useState({
        examId: 'exam123', // In real app, selected from dropdown or passed via router state
        date: '',
        startTime: '',
        durationMinutes: 60,
        allowLateEntry: 15, // minutes
        selectedGroup: 'all'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Exam Scheduled Successfully!');
        // Redirect or show success message logic
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Schedule Exam</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 flex items-center mb-6">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-800 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Selected Exam: Midterm Computer Science</h3>
                            <p className="text-sm text-blue-700">45 Questions • Multiple Choice</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-md font-medium text-gray-900 flex items-center">
                                <CalendarIcon size={18} className="mr-2 text-indigo-500" /> Date & Time
                            </h3>

                            <Input
                                label="Exam Date"
                                type="date"
                                required
                                value={scheduleData.date}
                                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                            />

                            <Input
                                label="Start Time"
                                type="time"
                                required
                                value={scheduleData.startTime}
                                onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-md font-medium text-gray-900 flex items-center">
                                <Clock size={18} className="mr-2 text-indigo-500" /> Duration details
                            </h3>

                            <Input
                                label="Duration (Minutes)"
                                type="number"
                                min="10"
                                required
                                value={scheduleData.durationMinutes}
                                onChange={(e) => setScheduleData({ ...scheduleData, durationMinutes: e.target.value })}
                            />

                            <Input
                                label="Allow Late Entry Up To (Minutes)"
                                type="number"
                                min="0"
                                value={scheduleData.allowLateEntry}
                                onChange={(e) => setScheduleData({ ...scheduleData, allowLateEntry: e.target.value })}
                                helpText="Students entering after this time will not be permitted."
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 flex items-center mb-4">
                            <Users size={18} className="mr-2 text-indigo-500" /> Assignment
                        </h3>

                        <div className="space-y-3">
                            <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="radio"
                                    name="group"
                                    value="all"
                                    checked={scheduleData.selectedGroup === 'all'}
                                    onChange={() => setScheduleData({ ...scheduleData, selectedGroup: 'all' })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <div className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900">All Enrolled Students</span>
                                    <span className="block text-sm text-gray-500">Assign to all 120 students in the section</span>
                                </div>
                            </label>

                            <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer text-opacity-50">
                                <input
                                    type="radio"
                                    name="group"
                                    value="specific"
                                    disabled
                                    checked={scheduleData.selectedGroup === 'specific'}
                                    onChange={() => setScheduleData({ ...scheduleData, selectedGroup: 'specific' })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <div className="ml-3">
                                    <span className="block text-sm font-medium text-gray-500">Specific Student Groups (PRO feature)</span>
                                    <span className="block text-sm text-gray-400">Select specific batches or individual students</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button type="submit" size="lg">Confirm Schedule</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleExam;
