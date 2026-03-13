import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md',
    preventClose = false
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !preventClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, preventClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={() => !preventClose && onClose()}
                />

                <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidth}`}>
                    {(title || !preventClose) && (
                        <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-gray-200">
                            {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
                            {!preventClose && (
                                <button
                                    type="button"
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
