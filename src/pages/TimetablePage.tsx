
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TimetableManager from '@/components/timetable/TimetableManager';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const TimetablePage: React.FC = () => {
  return (
    <AppLayout title="Timetable Management">
      <div className="container mx-auto py-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Timetable Management</h1>
          <Button variant="outline" asChild>
            <Link to="/settings" state={{ from: 'timetable' }}>
              <Settings className="h-4 w-4 mr-2" />
              School Timings Settings
            </Link>
          </Button>
        </div>
        <TimetableManager />
      </div>
    </AppLayout>
  );
};

export default TimetablePage;
