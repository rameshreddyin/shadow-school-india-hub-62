
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TimetableManager from '@/components/timetable/TimetableManager';

const TimetablePage: React.FC = () => {
  return (
    <AppLayout title="Timetable Management">
      <div className="container mx-auto py-6">
        <TimetableManager />
      </div>
    </AppLayout>
  );
};

export default TimetablePage;
