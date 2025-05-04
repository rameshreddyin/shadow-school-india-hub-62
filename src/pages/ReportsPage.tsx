
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const ReportsPage: React.FC = () => {
  return (
    <AppLayout title="Reports">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Reports Generation</h1>
        <p className="text-muted-foreground">
          Generate various reports about students, teachers, attendance, and performance.
        </p>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
