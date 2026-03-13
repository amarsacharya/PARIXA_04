import React from 'react';

const Loader = ({ filled = false, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const spinner = (
        <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]} ${className}`} />
    );

    if (filled) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-4">
            {spinner}
        </div>
    );
};

export default Loader;
