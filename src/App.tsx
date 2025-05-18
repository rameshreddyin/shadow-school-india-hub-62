
import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import ClassesPage from './pages/ClassesPage';
import AcademicCalendarPage from './pages/AcademicCalendarPage';
import NoticesPage from './pages/NoticesPage';
import TimetablePage from './pages/TimetablePage';
import AttendancePage from './pages/AttendancePage';
import FeesPage from './pages/FeesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AcademicYearSettingsPage from './pages/AcademicYearSettingsPage';
import ClassSectionManagerPage from './pages/ClassSectionManagerPage';
import CourseSubjectManagerPage from './pages/CourseSubjectManagerPage';
import StaffSalaryPage from './pages/StaffSalaryPage';
import NotFound from './pages/NotFound';
import TeacherInfoPage from './pages/TeacherInfoPage';
import EditTeacherPage from './pages/EditTeacherPage';
import StaffInfoPage from './pages/StaffInfoPage';
import EditStaffPage from './pages/EditStaffPage';
import { Toaster } from './components/ui/toaster';
import './App.css';
import { SidebarProvider } from './components/layout/SidebarProvider';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
        <Route path="/teachers" element={<ProtectedRoute><TeachersPage /></ProtectedRoute>} />
        <Route path="/teachers/:id" element={<ProtectedRoute><StaffInfoPage /></ProtectedRoute>} />
        <Route path="/teachers/edit/:id" element={<ProtectedRoute><EditStaffPage /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute><ClassesPage /></ProtectedRoute>} />
        <Route path="/academic-calendar" element={<ProtectedRoute><AcademicCalendarPage /></ProtectedRoute>} />
        <Route path="/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/fees" element={<ProtectedRoute><FeesPage /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><StaffSalaryPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/settings/academic-year" element={<ProtectedRoute><AcademicYearSettingsPage /></ProtectedRoute>} />
        <Route path="/settings/classes" element={<ProtectedRoute><ClassSectionManagerPage /></ProtectedRoute>} />
        <Route path="/settings/subjects" element={<ProtectedRoute><CourseSubjectManagerPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
