
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useLocation } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import AcademicYearSettings from '@/components/settings/AcademicYearSettings';
import FeeStructureManager from '@/components/settings/FeeStructureManager';
import SchoolTimingsSettings from '@/components/settings/SchoolTimingsSettings';

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("academic-year");
  
  // Check if we have a tab parameter in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['academic-year', 'fee-structure', 'school-timings', 'general'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Also check if we're coming from the timetable page
    if (location.state && location.state.from === 'timetable') {
      setActiveTab('school-timings');
    }
  }, [location]);
  
  return (
    <AppLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Configure application settings, user permissions, and system preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="academic-year">Academic Year</TabsTrigger>
            <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
            <TabsTrigger value="school-timings">School Timings</TabsTrigger>
            <TabsTrigger value="general">General Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="academic-year" className="space-y-4">
            <AcademicYearSettings />
          </TabsContent>
          
          <TabsContent value="fee-structure" className="space-y-4">
            <FeeStructureManager />
          </TabsContent>
          
          <TabsContent value="school-timings" className="space-y-4">
            <SchoolTimingsSettings />
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <p className="text-muted-foreground">
                Configure general application settings and preferences. Additional settings options will be available in future updates.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
