import React, { useState } from 'react';
import { Sparkles, Save, AlignLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const GenerateFromSyllabus = () => {
    const [syllabus, setSyllabus] = useState('');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState([]);

    const handleGenerate = () => {
        if (!syllabus || !topic) return;

        setIsGenerating(true);

        // Mock AI Generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedQuestions(Array(parseInt(questionCount)).fill(0).map((_, i) => ({
                id: i + 1,
                text: `Mock generated question ${i + 1} regarding ${topic}?`,
                options: [
                    `Option A for question ${i + 1}`,
                    `Option B for question ${i + 1}`,
                    `Option C for question ${i + 1}`,
                    `Option D for question ${i + 1}`
                ],
                correctAnswer: 0,
                difficulty: i % 3 === 0 ? 'hard' : i % 2 === 0 ? 'medium' : 'easy'
            })));
        }, 2500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Questions from Syllabus</h1>
                <p className="text-gray-600 mb-6">Paste your curriculum or syllabus text, and AI will generate balanced Multiple Choice Questions.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Subject Title</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Introduction to Machine Learning"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus Details (Paste text here)</label>
                            <textarea
                                value={syllabus}
                                onChange={(e) => setSyllabus(e.target.value)}
                                rows={8}
                                placeholder="Paste the syllabus sections, paragraphs from a textbook, or lecture notes here..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 h-fit space-y-4">
                        <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">Input Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                            <input
                                type="number"
                                min="5"
                                max="50"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-black bg-white"
                            />
                        </div>

                        <div className="pt-4 mt-6 border-t border-gray-200">
                            <Button
                                fullWidth
                                onClick={handleGenerate}
                                className="flex items-center justify-center font-bold"
                                isLoading={isGenerating}
                                disabled={!topic || !syllabus.trim() || syllabus.length < 20}
                            >
                                {!isGenerating && <Sparkles size={18} className="mr-2" />}
                                Generate AI Magic
                            </Button>
                            {syllabus && syllabus.length < 20 && (
                                <p className="mt-2 text-xs text-red-500 text-center">Please provide more syllabus text.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {generatedQuestions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <h2 className="text-xl font-bold flex items-center">
                            <Sparkles className="text-indigo-500 mr-2" size={24} />
                            Generated Questions
                        </h2>
                        <Button variant="secondary" className="flex items-center">
                            <Save size={16} className="mr-2" /> Save Draft
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {generatedQuestions.map((q, qIndex) => (
                            <div key={q.id} className="p-5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                <div className="flex justify-between mb-3">
                                    <div className="font-medium text-gray-900 flex gap-2">
                                        <span className="text-gray-500">{q.id}.</span> {q.text}
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded flex items-center h-fit ${q.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                                            q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {q.difficulty}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className={`p-3 rounded border text-sm ${i === q.correctAnswer ? 'bg-green-50 border-green-300 text-green-900 font-medium' : 'bg-gray-50 border-gray-200 text-gray-700'
                                            }`}>
                                            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Button className="px-8">Finalize & Add to Exam</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateFromSyllabus;
