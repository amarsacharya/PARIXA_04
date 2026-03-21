import api from './api';

export const userService = {
    // Admin specific
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/admin/register', userData);
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }
};
