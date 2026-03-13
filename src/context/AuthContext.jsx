import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Try real endpoint
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.warn('Failed to authenticate token with backend. Using mock user for demo.');
                    // If backend fails but we have the mock token, set a mock user so ProtectedRoutes work
                    if (token === 'mock-jwt-token-123') {
                        // Determine role based on window.location or default
                        let role = 'student';
                        if (window.location.pathname.includes('admin')) role = 'admin';
                        if (window.location.pathname.includes('teacher')) role = 'teacher';

                        setUser({ id: 1, name: 'Demo User', role: role });
                    } else {
                        localStorage.removeItem('token');
                    }
                }
            }
            setLoading(false);
        };

        // Add a small delay to prevent flicker during fast local reloads
        setTimeout(initAuth, 100);
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
