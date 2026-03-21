import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Upload } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { userService } from '../../services/userService';
import api from '../../services/api';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoleForModal, setSelectedRoleForModal] = useState('student');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBulkImporting, setIsBulkImporting] = useState(false);

    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    // Fetch real data from MongoDB
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAllUsers();
                // Map _id to id for the frontend
                const formattedUsers = data.map(user => ({
                    ...user,
                    id: user._id, 
                    status: 'active' // Since status isn't built into model yet
                }));
                setUsers(formattedUsers);
            } catch (error) {
                console.error("Failed to load users:", error);
            } finally {
                setIsLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    const handleCSVUpload = async (e, role) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
            
            // Assume format: Name,Email,Class (skip header if it contains "email")
            const startIndex = rows[0].toLowerCase().includes('email') ? 1 : 0;
            const userData = rows.slice(startIndex).map(row => {
                const parts = row.split(',');
                return {
                    name: parts[0]?.trim(),
                    email: parts[1]?.trim(),
                    assignedClass: role === 'student' ? (parts[2]?.trim() || 'Unassigned') : role === 'teacher' ? 'Teacher' : 'Admin',
                    role: role
                };
            }).filter(u => u.name && u.email);

            if (userData.length === 0) {
                alert(`No valid users found in CSV. Format should be: Name, Email${role === 'student' ? ', Class (optional)' : ''}`);
                return;
            }

            if (!window.confirm(`Register ${userData.length} ${role}s from CSV? Emails will be sent.`)) return;

            try {
                setIsBulkImporting(true);
                const res = await api.post('/admin/register-bulk', { users: userData });
                alert(`Bulk Import Complete: ${res.data.details.filter(d => d.status === 'success').length} succeeded.`);
                window.location.reload(); // Refresh to see new users
            } catch (err) {
                alert("Bulk Import Failed: " + (err.response?.data?.message || err.message));
            } finally {
                setIsBulkImporting(false);
            }
        };
        reader.readAsText(file);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleEdit = (user) => {
        setSelectedUser(user);
        setSelectedRoleForModal(user.role || 'student');
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedUser(null);
        setSelectedRoleForModal('student');
        setIsModalOpen(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        let calculatedClass = formData.get('userClass') || 'Unassigned';
        if (formData.get('userRole') === 'teacher') calculatedClass = 'Teacher';
        if (formData.get('userRole') === 'admin') calculatedClass = 'Admin';

        const userData = {
            name: formData.get('userName'),
            email: formData.get('userEmail'),
            role: formData.get('userRole'),
            assignedClass: calculatedClass
        };

        try {
            setIsSubmitting(true);
            
            if (!selectedUser) {
                // Add new user via backend
                const response = await userService.createUser(userData);
                
                // Update local state temporarily so it reflects 
                const newUser = {
                    id: response.userId || Date.now(),
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    assignedClass: userData.assignedClass,
                    status: 'active'
                };
                setUsers([...users, newUser]);
                alert(`${userData.role} successfully registered! Passwords sent via email.`);
            } else {
                await userService.updateUser(selectedUser.id, userData);
                setUsers(users.map(u => 
                    u.id === selectedUser.id ? { ...u, ...userData } : u
                ));
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'Error registering user.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? Action cannot be undone.')) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(error.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="flex gap-3">
                    <input 
                        type="file" 
                        id="csvInputStudent" 
                        accept=".csv" 
                        className="hidden" 
                        onChange={(e) => handleCSVUpload(e, 'student')}
                    />
                    <input 
                        type="file" 
                        id="csvInputTeacher" 
                        accept=".csv" 
                        className="hidden" 
                        onChange={(e) => handleCSVUpload(e, 'teacher')}
                    />
                    <div className="flex bg-indigo-50 rounded-md border border-indigo-200 overflow-hidden">
                        <Button 
                            variant="secondary" 
                            onClick={() => document.getElementById('csvInputStudent').click()}
                            isLoading={isBulkImporting}
                            className="flex items-center text-indigo-700 bg-transparent hover:bg-indigo-100 border-none rounded-none border-r border-indigo-200"
                        >
                            <Upload size={16} className="mr-2" /> Students (CSV)
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={() => document.getElementById('csvInputTeacher').click()}
                            isLoading={isBulkImporting}
                            className="flex items-center text-indigo-700 bg-transparent hover:bg-indigo-100 border-none rounded-none"
                        >
                            <Upload size={16} className="mr-2" /> Teachers (CSV)
                        </Button>
                    </div>
                    <Button onClick={handleAddNew} className="flex items-center bg-indigo-600">
                        <Plus size={16} className="mr-2" /> Add New User
                    </Button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class/Div</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoadingUsers ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">
                                            {user.assignedClass || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mx-2">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 mx-2">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No users found matching your search criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* User Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? "Edit User" : "Add New User"}
            >
                <form onSubmit={handleSaveUser} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="userName"
                        defaultValue={selectedUser?.name || ''}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="userEmail"
                        defaultValue={selectedUser?.email || ''}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                name="userRole"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
                                value={selectedRoleForModal}
                                onChange={(e) => setSelectedRoleForModal(e.target.value)}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <Input
                            label="Class/Section (e.g. CSE VIA)"
                            name="userClass"
                            defaultValue={selectedUser?.assignedClass || ''}
                            placeholder="Optional"
                            disabled={selectedRoleForModal !== 'student'}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
