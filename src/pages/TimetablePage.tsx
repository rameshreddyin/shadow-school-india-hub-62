
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const TimetablePage: React.FC = () => {
  return (
    <AppLayout title="Timetable">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Timetable Management</h1>
        <p className="text-muted-foreground">
          Create and manage class schedules, teacher assignments, and room allocations.
        </p>
      </div>
    </AppLayout>
  );
};

export default TimetablePage;
