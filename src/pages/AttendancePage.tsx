
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const AttendancePage: React.FC = () => {
  return (
    <AppLayout title="Attendance">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Attendance Management</h1>
        <p className="text-muted-foreground">
          Record and monitor student and staff attendance, generate reports.
        </p>
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
