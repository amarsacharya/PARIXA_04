import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    className = '',
    fullWidth = true,
    ...props
}, ref) => {
    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
          bg-white border text-gray-900 px-3 py-2
          ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
          ${props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
