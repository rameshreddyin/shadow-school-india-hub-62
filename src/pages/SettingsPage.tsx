
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from '@/components/settings/GeneralSettings';
import AcademicYearSettings from '@/components/settings/AcademicYearSettings';
import FeeStructureManager from '@/components/settings/FeeStructureManager';

const SettingsPage: React.FC = () => {
  return (
    <AppLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings, user permissions, and system preferences.
          </p>
        </div>
        
        <Tabs defaultValue="academic" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="academic">Academic Year</TabsTrigger>
            <TabsTrigger value="fees">Fee Structure</TabsTrigger>
            <TabsTrigger value="general">General Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="academic">
            <AcademicYearSettings />
          </TabsContent>
          
          <TabsContent value="fees">
            <FeeStructureManager />
          </TabsContent>
          
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
