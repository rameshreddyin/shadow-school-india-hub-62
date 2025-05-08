
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

// Eagerly loaded components
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoadingFallback from "./components/LoadingFallback";

// Lazily loaded components
const StudentsPage = lazy(() => import("./pages/StudentsPage"));
const TeachersPage = lazy(() => import("./pages/TeachersPage"));
const TeacherInfoPage = lazy(() => import("./pages/TeacherInfoPage"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const TimetablePage = lazy(() => import("./pages/TimetablePage"));
const FeesPage = lazy(() => import("./pages/FeesPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const NoticesPage = lazy(() => import("./pages/NoticesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AcademicYearSettingsPage = lazy(() => import("./pages/AcademicYearSettingsPage"));
const ClassSectionManagerPage = lazy(() => import("./pages/ClassSectionManagerPage"));
const CourseSubjectManagerPage = lazy(() => import("./pages/CourseSubjectManagerPage"));

// Create query client with better error and retry handling for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      // No specific mutation options needed
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner richColors closeButton />
          <SidebarProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/students" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <StudentsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/teachers" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <TeachersPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/teachers/:id" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <TeacherInfoPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AttendancePage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/timetable" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <TimetablePage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/fees" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <FeesPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <ReportsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/notices" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <NoticesPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <SettingsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/academic-year-settings" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AcademicYearSettingsPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/class-section-manager" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <ClassSectionManagerPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/course-subject-manager" element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <CourseSubjectManagerPage />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
