
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from '@/components/settings/GeneralSettings';

const SettingsPage: React.FC = () => {
  return (
    <AppLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 overflow-x-auto flex-wrap whitespace-nowrap">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="academic">Academic Year</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="fees">Fee Structure</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="academic">
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Academic Year Settings (Coming Soon)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="subjects">
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Subject Settings (Coming Soon)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="fees">
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Fee Structure Settings (Coming Soon)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Notification Settings (Coming Soon)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="backup">
            <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Backup & Restore (Coming Soon)</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
