
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';

const FeesPage: React.FC = () => {
  return (
    <AppLayout title="Fees">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Fees Management</h1>
        <p className="text-muted-foreground">
          Manage fee structures, payments, dues, and generate receipts.
        </p>
      </div>
    </AppLayout>
  );
};

export default FeesPage;
