
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const NoticesPage: React.FC = () => {
  return (
    <AppLayout title="Notices">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Notice Management</h1>
        <p className="text-muted-foreground">
          Create, publish, and distribute notices to students, parents, and staff.
        </p>
      </div>
    </AppLayout>
  );
};

export default NoticesPage;
