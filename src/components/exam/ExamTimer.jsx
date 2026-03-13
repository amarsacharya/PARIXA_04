import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ExamTimer = ({ durationMinutes, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onTimeUp) onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isWarning = timeLeft < 300; // Less than 5 minutes

    return (
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-bold shadow-sm border ${isWarning ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-white text-gray-800 border-gray-200'
            }`}>
            <Clock size={20} className={isWarning ? 'text-red-500' : 'text-gray-500'} />
            <span>{formatTime(timeLeft)}</span>
        </div>
    );
};

export default ExamTimer;
