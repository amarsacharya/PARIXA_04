import React, { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import DifficultyChart from '../../components/analytics/DifficultyChart'; // Reuse chart!

const CreateExam = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        numQuestions: 20
    });

    const [showPreview, setShowPreview] = useState(false);

    // Mock predicted difficulty based on user inputs
    const diffData = [
        { name: 'Easy', value: Math.floor(parseInt(formData.numQuestions || 0) * 0.3), color: '#10B981' },
        { name: 'Medium', value: Math.floor(parseInt(formData.numQuestions || 0) * 0.5), color: '#F59E0B' },
        { name: 'Hard', value: Math.floor(parseInt(formData.numQuestions || 0) * 0.2), color: '#EF4444' }
    ];

    const handlePreview = () => {
        if (!formData.title) return;
        setShowPreview(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Create New Exam Blueprint</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Exam Content</h2>

                        <Input
                            label="Exam Title"
                            placeholder="e.g., Final Year Programming Assessment"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <textarea
                                rows={3}
                                placeholder="Brief description or instructions for students"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white text-black"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Target Number of Questions"
                                type="number"
                                min="5"
                                value={formData.numQuestions}
                                onChange={(e) => setFormData({ ...formData, numQuestions: e.target.value })}
                            />
                            <div className="flex flex-col justify-end">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                                <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option>Multiple Choice (MCQ)</option>
                                    <option>Subjective</option>
                                    <option>Mixed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Question Selection</h2>
                            <Button size="sm" variant="secondary" className="flex items-center">
                                <Plus size={16} className="mr-1" /> Add Manual Question
                            </Button>
                        </div>
                        <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center bg-gray-50">
                            <p className="text-gray-500 mb-4">You have not added any specific questions yet.</p>
                            <div className="flex justify-center flex-wrap gap-3">
                                <Button variant="secondary" onClick={() => window.location.href = '/teacher/generate-syllabus'}>
                                    Generate from Syllabus
                                </Button>
                                <Button variant="secondary" onClick={() => window.location.href = '/teacher/upload-pdf'}>
                                    Import from PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase mb-3 text-center">Difficulty Distribution Preview</h3>
                        <div className="h-48">
                            <DifficultyChart data={diffData} title="" />
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2 italic">Based on standard balanced generation</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3">
                        <Button fullWidth onClick={handlePreview} className="flex items-center justify-center">
                            <Eye size={18} className="mr-2" /> Preview Sample Sets
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                            The platform will auto-generate 3 unique, balanced sets by default to prevent cheating.
                        </p>
                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Generated Set Previews</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                Close
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto bg-gray-50 flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(setNum => (
                                <div key={setNum} className="bg-white p-4 rounded border border-gray-200">
                                    <div className="font-bold text-center border-b pb-2 mb-4 bg-indigo-50 text-indigo-800 rounded">Set {String.fromCharCode(64 + setNum)}</div>
                                    <div className="space-y-4">
                                        <div className="text-sm p-2 rounded bg-gray-50 border whitespace-pre-wrap">Q1. Mock question generated for this specific set variation...</div>
                                        <div className="text-sm p-2 rounded bg-gray-50 border">Q2. Another varied wording of core concept...</div>
                                        <div className="text-xs text-center text-gray-400 font-style: italic">... {formData.numQuestions - 2} more questions</div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
                                        <span>Easy: {diffData[0].value}</span>
                                        <span>Med: {diffData[1].value}</span>
                                        <span>Hard: {diffData[2].value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <Button onClick={() => setShowPreview(false)} variant="secondary">Cancel</Button>
                            <Button onClick={() => { setShowPreview(false); window.location.href = '/teacher/exam/schedule'; }}>Confirm & Go to Scheduling</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateExam;
