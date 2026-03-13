import React from 'react';

const QuestionPalette = ({
    questions,
    currentIndex,
    answers,
    markedForReview,
    onSelectQuestion
}) => {

    const getStatusColor = (questionId, index) => {
        if (index === currentIndex) {
            return 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300';
        }

        const isAnswered = !!answers[questionId];
        const isMarked = markedForReview.includes(questionId);

        if (isAnswered && isMarked) return 'bg-purple-500 text-white border-purple-600';
        if (isAnswered) return 'bg-green-500 text-white border-green-600';
        if (isMarked) return 'bg-orange-400 text-white border-orange-500';
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    };

    const answeredCount = Object.keys(answers).length;
    const markedCount = markedForReview.length;
    const notVisitedCount = questions.length - answeredCount - markedCount; // Rough approx

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Question Palette</h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-6">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-500 mr-2"></div> Answered
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-orange-400 mr-2"></div> Marked Review
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-purple-500 mr-2"></div> Answered & Marked
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded border border-gray-300 bg-white mr-2"></div> Not Answered
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-2 mb-4 max-h-[40vh]">
                {questions.map((q, index) => (
                    <button
                        key={q.id}
                        onClick={() => onSelectQuestion(index)}
                        className={`
              w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium border
              transition-colors
              ${getStatusColor(q.id, index)}
            `}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-auto pt-4 border-t text-sm text-gray-600">
                <div className="flex justify-between mb-1">
                    <span>Answered</span>
                    <span className="font-semibold text-green-600">{answeredCount}</span>
                </div>
                <div className="flex justify-between">
                    <span>Total Questions</span>
                    <span className="font-semibold">{questions.length}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionPalette;
