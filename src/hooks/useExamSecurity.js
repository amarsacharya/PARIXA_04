import { useState, useEffect, useCallback } from 'react';

export const useExamSecurity = (onViolationLimitReached) => {
    const [violationCount, setViolationCount] = useState(0);
    const [isWarningVisible, setIsWarningVisible] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const handleViolation = useCallback(() => {
        if (isLocked) return;

        setViolationCount((prev) => {
            const newCount = prev + 1;

            if (newCount === 1) {
                setIsWarningVisible(true);
            } else if (newCount >= 2) {
                setIsLocked(true);
                if (onViolationLimitReached) {
                    onViolationLimitReached(); // Trigger auto-submit
                }
            }

            return newCount;
        });
    }, [isLocked, onViolationLimitReached]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleViolation();
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation();
            }
        };

        const handleContextMenu = (e) => e.preventDefault();
        const handleCopyPaste = (e) => e.preventDefault();

        // Event Listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
        };
    }, [handleViolation]);

    const requestFullscreen = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error('Error attempting to enable fullscreen:', err);
        }
    };

    const dismissWarning = () => {
        setIsWarningVisible(false);
        requestFullscreen();
    };

    return {
        violationCount,
        isWarningVisible,
        isLocked,
        dismissWarning,
        requestFullscreen
    };
};
