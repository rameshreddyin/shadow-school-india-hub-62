
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AttendanceTabs from '@/components/attendance/AttendanceTabs';

const AttendancePage: React.FC = () => {
  return (
    <AppLayout title="Attendance Management">
      <div className="container mx-auto">
        <AttendanceTabs />
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
