
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CalendarCheck, Calendar, Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Sample data for KPIs
  const kpiData = {
    totalStudents: 1248,
    totalTeachers: 85,
    feesCollected: "₹24,56,000",
    todayAttendance: "92%",
  };

  // Quick action buttons
  const quickActions = [
    { label: 'Add Student', icon: Users, color: 'bg-gray-100' },
    { label: 'Mark Attendance', icon: CalendarCheck, color: 'bg-gray-100' },
    { label: 'Generate Timetable', icon: Calendar, color: 'bg-gray-100' },
    { label: 'Send Notice', icon: Bell, color: 'bg-gray-100' },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Welcome, Admin</h2>
            <p className="text-gray-500">Here's what's happening with your school today.</p>
          </div>
          <div className="text-sm text-gray-500">
            <p className="font-semibold">Today's Date</p>
            <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
              <div className="bg-gray-100 p-2 rounded-md">
                <Users size={18} className="text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">Across all classes</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Total Teachers</CardTitle>
              <div className="bg-gray-100 p-2 rounded-md">
                <Users size={18} className="text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalTeachers}</div>
              <p className="text-xs text-gray-500 mt-1">Staff members</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Fees Collected</CardTitle>
              <div className="bg-gray-100 p-2 rounded-md">
                <Calendar size={18} className="text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.feesCollected}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Attendance</CardTitle>
              <div className="bg-gray-100 p-2 rounded-md">
                <CalendarCheck size={18} className="text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.todayAttendance}</div>
              <p className="text-xs text-gray-500 mt-1">Students present</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-3 border-2 hover:bg-gray-50 transition-colors"
              >
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon size={20} className="text-gray-700" />
                </div>
                <span className="font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Recent Notices */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <h4 className="font-medium">Annual Day Preparations</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    All teachers are requested to prepare their students for the upcoming annual day celebrations.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex flex-col items-center justify-center bg-gray-100 h-12 w-12 rounded text-center">
                    <span className="text-sm font-bold">{10 + index}</span>
                    <span className="text-xs">May</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Parent-Teacher Meeting</h4>
                    <p className="text-sm text-gray-500">9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
