import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Protection
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public/Auth
import Login from '../pages/auth/Login';
import NotFound from '../pages/NotFound';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';

// Teacher
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import CreateExam from '../pages/teacher/CreateExam';
import GenerateFromSyllabus from '../pages/teacher/GenerateFromSyllabus';
import UploadPDF from '../pages/teacher/UploadPDF';
import ScheduleExam from '../pages/teacher/ScheduleExam';
import Results from '../pages/teacher/Results';
import Analytics from '../pages/teacher/Analytics';

// Student
import StudentDashboard from '../pages/student/StudentDashboard';
import ExamPage from '../pages/student/ExamPage';
import StudentResults from '../pages/student/StudentResults';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                </Route>
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    <Route path="exam/create" element={<CreateExam />} />
                    <Route path="generate-syllabus" element={<GenerateFromSyllabus />} />
                    <Route path="upload-pdf" element={<UploadPDF />} />
                    <Route path="exam/schedule" element={<ScheduleExam />} />
                    <Route path="results" element={<Results />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>
            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                {/* Dashboard layout for student home and results */}
                <Route path="/student" element={<DashboardLayout />}>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="results" element={<StudentResults />} />
                </Route>

                {/* Exam page needs full screen, no dashboard layout */}
                <Route path="/student/exam/:examId" element={<ExamPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
