import React from 'react';
import { Users, FileText, Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    // Mock Data
    const stats = [
        { name: 'Total Users', value: '1,245', icon: Users, color: 'bg-blue-500' },
        { name: 'Active Exams', value: '34', icon: FileText, color: 'bg-green-500' },
        { name: 'System Load', value: '42%', icon: Activity, color: 'bg-purple-500' },
        { name: 'Security Alerts', value: '0', icon: ShieldCheck, color: 'bg-red-500' },
    ];

    const recentUsers = [
        { id: 1, name: 'John Doe', role: 'student', joinDate: '2023-10-25' },
        { id: 2, name: 'Jane Smith', role: 'teacher', joinDate: '2023-10-24' },
        { id: 3, name: 'Alice Johnson', role: 'student', joinDate: '2023-10-24' },
        { id: 4, name: 'Bob Wilson', role: 'student', joinDate: '2023-10-23' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link to="/admin/users" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors">
                    Manage Users
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className={`p-3 rounded-md ${item.color} text-white`}>
                                        <item.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6 text-gray-900 font-medium border-b border-gray-200">
                    Recently Added Users
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
