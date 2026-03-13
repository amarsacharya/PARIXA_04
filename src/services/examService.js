import api from './api';

export const examService = {
    // Common
    getExamById: async (examId) => {
        const response = await api.get(`/exams/${examId}`);
        return response.data;
    },

    // Teacher specific
    createExam: async (examData) => {
        const response = await api.post('/exams', examData);
        return response.data;
    },

    scheduleExam: async (examId, scheduleData) => {
        const response = await api.post(`/exams/${examId}/schedule`, scheduleData);
        return response.data;
    },

    uploadPDF: async (formData) => {
        const response = await api.post('/exams/extract-pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    generateFromSyllabus: async (data) => {
        const response = await api.post('/exams/generate-ai', data);
        return response.data;
    },

    getTeacherExams: async () => {
        const response = await api.get('/exams/teacher');
        return response.data;
    },

    // Student specific
    getStudentExams: async () => {
        const response = await api.get('/exams/student');
        return response.data;
    },

    submitExam: async (examId, answers, violations) => {
        const response = await api.post(`/exams/${examId}/submit`, { answers, violations });
        return response.data;
    }
};
