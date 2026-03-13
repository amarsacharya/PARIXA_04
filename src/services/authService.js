import api from './api';

export const authService = {
    login: async (credentials) => {
        // Expected to return { token, user: { id, role, name, etc. } }
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};
