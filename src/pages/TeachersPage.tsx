
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const TeachersPage: React.FC = () => {
  return (
    <AppLayout title="Teachers">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Teacher Management</h1>
        <p className="text-muted-foreground">
          Manage teaching staff, their information, schedules, and performance.
        </p>
      </div>
    </AppLayout>
  );
};

export default TeachersPage;
