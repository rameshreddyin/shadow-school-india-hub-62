
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import AcademicYearSettings from '@/components/settings/AcademicYearSettings';
import FeeStructureManager from '@/components/settings/FeeStructureManager';

const SettingsPage: React.FC = () => {
  return (
    <AppLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Configure application settings, user permissions, and system preferences.
          </p>
        </div>

        <Tabs defaultValue="academic-year" className="w-full">
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="academic-year">Academic Year</TabsTrigger>
            <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
            <TabsTrigger value="general">General Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="academic-year" className="space-y-4">
            <AcademicYearSettings />
          </TabsContent>
          
          <TabsContent value="fee-structure" className="space-y-4">
            <FeeStructureManager />
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
