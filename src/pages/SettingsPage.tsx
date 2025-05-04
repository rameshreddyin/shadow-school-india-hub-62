
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const SettingsPage: React.FC = () => {
  return (
    <AppLayout title="Settings">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">System Settings</h1>
        <p className="text-muted-foreground">
          Configure application settings, user permissions, and system preferences.
        </p>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
