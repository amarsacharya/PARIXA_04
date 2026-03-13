import React from 'react';
import Modal from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

const WarningModal = ({ isOpen, onAcknowledge, violationCount }) => {
    return (
        <Modal isOpen={isOpen} preventClose={true} maxWidth="max-w-md">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Security Violation Detected!
                </h3>

                <div className="mt-2 text-sm text-gray-600 space-y-3">
                    <p>
                        You have triggered a security violation by either exiting fullscreen, switching tabs, or attempting an unauthorized action.
                    </p>
                    <p className="font-semibold text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        Violation {violationCount} / 2
                    </p>
                    <p className="text-gray-500 italic">
                        Note: Maximum allowed violations is 2. The second violation will automatically submit your exam and lock you out.
                    </p>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onAcknowledge}
                        className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        I Understand, Return to Exam (Enable Fullscreen)
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default WarningModal;
