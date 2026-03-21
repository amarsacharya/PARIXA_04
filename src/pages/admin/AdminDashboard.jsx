import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity, ShieldCheck, GraduationCap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await userService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to load dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const studentsCount = users.filter(u => u.role === 'student').length;
    const teachersCount = users.filter(u => u.role === 'teacher').length;

    const stats = [
        { name: 'Total Members', value: loading ? '...' : users.length.toString(), icon: Users, color: 'bg-indigo-500' },
        { name: 'Registered Students', value: loading ? '...' : studentsCount.toString(), icon: GraduationCap, color: 'bg-green-500' },
        { name: 'Active Teachers', value: loading ? '...' : teachersCount.toString(), icon: BookOpen, color: 'bg-blue-500' },
        { name: 'Security Alerts', value: '0', icon: ShieldCheck, color: 'bg-red-500' },
    ];

    // Sort by newest first and grab top 5
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Overseer</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">High-level telemetry and user statistics</p>
                </div>
                <Link to="/admin/users" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 text-sm font-black uppercase tracking-widest transition-all">
                    Manage Accounts
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-[24px] border border-gray-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${item.color} text-white shadow-inner`}>
                                <item.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div>
                                <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate mb-1">{item.name}</dt>
                                <dd className="text-3xl font-black text-gray-900 leading-none">{item.value}</dd>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Platform Registrations</h2>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-white border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">User Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Authority Level</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Registration Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-10 text-center text-sm font-medium text-gray-400">Loading directory...</td>
                                </tr>
                            ) : recentUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                <div className="text-[10px] text-gray-400 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2 py-1 inline-flex text-[10px] font-black uppercase tracking-widest rounded-md ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {recentUsers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="3" className="px-8 py-10 text-center text-sm font-medium text-gray-400">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
