
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import AttendancePage from "./pages/AttendancePage";
import TimetablePage from "./pages/TimetablePage";
import FeesPage from "./pages/FeesPage";
import ReportsPage from "./pages/ReportsPage";
import NoticesPage from "./pages/NoticesPage";
import SettingsPage from "./pages/SettingsPage";
import AcademicYearSettingsPage from "./pages/AcademicYearSettingsPage";
import ClassSectionManagerPage from "./pages/ClassSectionManagerPage";
import CourseSubjectManagerPage from "./pages/CourseSubjectManagerPage";
import NotFound from "./pages/NotFound";

// Create query client with better error and retry handling for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
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
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
                <Route path="/teachers" element={<ProtectedRoute><TeachersPage /></ProtectedRoute>} />
                <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
                <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
                <Route path="/fees" element={<ProtectedRoute><FeesPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/academic-year-settings" element={<ProtectedRoute><AcademicYearSettingsPage /></ProtectedRoute>} />
                <Route path="/class-section-manager" element={<ProtectedRoute><ClassSectionManagerPage /></ProtectedRoute>} />
                <Route path="/course-subject-manager" element={<ProtectedRoute><CourseSubjectManagerPage /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
