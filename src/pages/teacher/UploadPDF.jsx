import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Button from '../../components/common/Button';

const UploadPDF = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [extractedQuestions, setExtractedQuestions] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');

        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Please upload a valid PDF file.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size exceeds 5MB limit.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const clearFile = () => {
        setFile(null);
        setExtractedQuestions([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = () => {
        if (!file) return;

        setIsUploading(true);

        // Mock API call for PDF extraction
        setTimeout(() => {
            setIsUploading(false);
            setExtractedQuestions([
                { id: 1, text: "What is the primary function of the mitochondria?", difficulty: "easy", type: "MCQ" },
                { id: 2, text: "Explain the process of cellular respiration.", difficulty: "hard", type: "Subjective" },
                { id: 3, text: "Which vitamin is synthesized by sunlight?", difficulty: "easy", type: "MCQ" },
                { id: 4, text: "Describe the differences between DNA and RNA.", difficulty: "medium", type: "Subjective" },
            ]);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload PDF Question Paper</h1>
                <p className="text-gray-600 mb-6">Our AI will extract the questions automatically and analyze their difficulty.</p>

                {!extractedQuestions.length ? (
                    <div className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-lg p-10 text-center ${error ? 'border-red-300 bg-red-50' : file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} transition-colors cursor-pointer`}
                            onClick={() => !file && fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf"
                            />

                            {file ? (
                                <div className="flex flex-col items-center">
                                    <File className="h-12 w-12 text-indigo-500 mb-3" />
                                    <p className="text-lg font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                                    <div className="mt-4 flex space-x-3">
                                        <Button onClick={(e) => { e.stopPropagation(); clearFile(); }} variant="secondary" size="sm">
                                            Remove
                                        </Button>
                                        <Button onClick={(e) => { e.stopPropagation(); handleUpload(); }} isLoading={isUploading} size="sm">
                                            {isUploading ? 'Extracting...' : 'Extract Questions'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                    <p className="text-lg font-medium text-gray-900">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500 mt-1">PDF format up to 5MB</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded">
                                <AlertCircle size={16} className="mr-2" />
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6 flex flex-col items-center">
                        {/* Success state heading area */}
                    </div>
                )}
            </div>

            {extractedQuestions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center text-green-600">
                            <CheckCircle2 size={24} className="mr-2" />
                            <h2 className="text-xl font-bold">Extraction Successful</h2>
                        </div>
                        <Button variant="secondary" onClick={clearFile} size="sm">Upload Another</Button>
                    </div>

                    <p className="text-gray-600 mb-4">Found {extractedQuestions.length} questions in the uploaded document.</p>

                    <div className="space-y-4">
                        {extractedQuestions.map((q, index) => (
                            <div key={q.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 relative">
                                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                                    <X size={16} />
                                </button>
                                <div className="flex items-start gap-3 w-11/12">
                                    <div className="font-bold text-gray-500 mt-0.5">Q{index + 1}.</div>
                                    <div>
                                        <p className="text-gray-900 font-medium mb-2">{q.text}</p>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${q.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                                                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {q.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button>Add to Question Bank</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadPDF;
