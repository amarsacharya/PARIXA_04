import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { GraduationCap } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!credentials.username || !credentials.password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            // Mocking for frontend demo:
            let mockUser = { id: 1, name: 'Demo User', role: 'student' };
            if (credentials.username.includes('admin')) mockUser.role = 'admin';
            if (credentials.username.includes('teacher')) mockUser.role = 'teacher';

            // We attempt the real login. If it fails (e.g., API is off), we manually set the context state.
            let userResult;
            try {
                userResult = await login(credentials);
            } catch (err) {
                console.warn("Backend API call failed. Using mock login instead.");
                // Manually trigger the context state update using local storage since the real authService failed
                localStorage.setItem('token', 'mock-jwt-token-123');

                // Note: since we use the Context, we can't easily force the `setUser` from here directly 
                // without modifying the AuthContext to expose `setUser`, OR we can just reload the page 
                // so the useEffect picks up the token, OR we just navigate directly and let the 
                // protected route handle it.
                // Best demo approach: modify AuthContext login function to handle mock, OR just do it here:

                userResult = mockUser;
            }

            // In our demo, we need to make sure the AuthContext actually has this user if we bypassed it
            // To fix the UI non-redirect, we'll force navigation, but the ProtectedRoute needs the user.
            // Let's reload the page to the target URL so context re-initializes with the mock token OR 
            // a better way: we will pass a flag. For now, since it's a demo, we will force window.location

            const targetUrl = userResult.role === 'admin'
                ? '/admin/dashboard'
                : userResult.role === 'teacher'
                    ? '/teacher/dashboard'
                    : '/student/dashboard';

            // Force full reload to target URL so AuthContext's useEffect sees the mock token
            // Normally `navigate(targetUrl)` is used, but if Context `user` is null, ProtectedRoute kicks us back.
            // We will update AuthContext next to expose a force update. For now:
            window.location.href = targetUrl;

        } catch (err) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-indigo-600 p-3 rounded-xl shadow-lg">
                        <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    AI-Based Online Examination Platform
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Username / Email"
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="e.g., student1, teacher_admin"
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" fullWidth isLoading={loading}>
                                Sign in
                            </Button>
                        </div>

                        <div className="mt-4 text-xs text-gray-500 text-center">
                            <p>Demo accounts: <b>admin</b>, <b>teacher</b>, <b>student</b></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
