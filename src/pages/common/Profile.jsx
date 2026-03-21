import React, { useState } from 'react';
import { User, Mail, Shield, Key, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
    const { user: authUser } = useAuth();
    const user = authUser || { name: 'Loading...', email: '...', role: 'loading...' };
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState(null);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        setIsUpdating(true);
        setMessage(null);
        try {
            await api.put('/auth/change-password', {
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated securely!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Personal Security Portal</h1>
                <p className="text-gray-500 font-medium">Manage your identity and protected access credentials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm text-center">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 border-4 border-white shadow-lg">
                            <User size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2">{user.role}</span>
                        
                        <div className="mt-8 pt-8 border-t border-gray-50 space-y-4 text-left">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="text-gray-400" size={18} />
                                <span className="text-gray-600 font-medium truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Shield className="text-green-500" size={18} />
                                <span className="text-green-700 font-bold uppercase text-[9px] tracking-widest">Biometric AI Secure</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                        <Key className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-5 group-hover:scale-110 transition-all" />
                        <h3 className="text-lg font-black mb-2">Encryption Tip</h3>
                        <p className="text-indigo-100 text-xs leading-relaxed opacity-80 italic">"Regularly updating your security PIN prevents unauthorized session hijacking."</p>
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-[40px] border border-gray-200 p-10 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                                <Key size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Credential Update</h2>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300 ${
                                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Identity Verification PIN (Current)</label>
                                <Input 
                                    type="password"
                                    placeholder="Enter Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    required
                                    className="h-16 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all shadow-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">New Access Key</label>
                                    <Input 
                                        type="password"
                                        placeholder="New Password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        required
                                        className="h-16 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all shadow-none"
                                    />
                                </div>
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm Access Key</label>
                                    <Input 
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        required
                                        className="h-16 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all shadow-none"
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                fullWidth 
                                isLoading={isUpdating}
                                className="h-16 bg-indigo-600 text-lg font-black rounded-2xl shadow-xl shadow-indigo-100 mt-4 active:scale-95 transition-all"
                            >
                                Secure Update Credentials
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
