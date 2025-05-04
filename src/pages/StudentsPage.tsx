
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const StudentsPage: React.FC = () => {
  return (
    <AppLayout title="Students">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Student Management</h1>
        <p className="text-muted-foreground">
          Manage all students, their information, classes, and performance.
        </p>
      </div>
    </AppLayout>
  );
};

export default StudentsPage;
