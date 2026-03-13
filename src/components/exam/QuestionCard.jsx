import React from 'react';

const QuestionCard = ({
    question,
    currentIndex,
    totalQuestions,
    selectedOption,
    onOptionSelect,
    onNext,
    onPrevious,
    onMarkReview,
    isMarked
}) => {
    if (!question) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Question {currentIndex + 1} <span className="text-gray-500 text-sm font-normal">of {totalQuestions}</span>
                </h2>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${question.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                        }`}>
                        {question.difficulty || 'medium'}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                        {question.marks || 1} mark(s)
                    </span>
                </div>
            </div>

            {/* Question Text */}
            <div className="text-gray-800 text-lg mb-6 flex-grow">
                {question.text}
                {question.image && (
                    <img src={question.image} alt="Question context" className="mt-4 max-h-64 rounded border object-contain" />
                )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
                {question.options?.map((option, index) => (
                    <label
                        key={index}
                        className={`
              flex items-center p-4 border rounded-lg cursor-pointer transition-colors
              ${selectedOption === option.id
                                ? 'bg-indigo-50 border-indigo-500'
                                : 'hover:bg-gray-50 border-gray-200'}
            `}
                    >
                        <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={selectedOption === option.id}
                            onChange={() => onOptionSelect(question.id, option.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-3 text-gray-700">{option.text}</span>
                    </label>
                ))}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-4 border-t mt-auto">
                <button
                    onClick={onMarkReview}
                    className={`px-4 py-2 text-sm font-medium rounded-md border ${isMarked
                            ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {isMarked ? 'Unmark Review' : 'Mark for Review'}
                </button>

                <div className="flex space-x-3">
                    <button
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        {currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
