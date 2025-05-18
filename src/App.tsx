
import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/teachers/:id" element={<StaffInfoPage />} />
        <Route path="/teachers/edit/:id" element={<EditStaffPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/academic-calendar" element={<AcademicCalendarPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/salary" element={<StaffSalaryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/academic-year" element={<AcademicYearSettingsPage />} />
        <Route path="/settings/classes" element={<ClassSectionManagerPage />} />
        <Route path="/settings/subjects" element={<CourseSubjectManagerPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
