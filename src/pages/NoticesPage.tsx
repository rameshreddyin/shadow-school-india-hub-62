
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoticesList from '@/components/notices/NoticesList';
import AddNoticeForm from '@/components/notices/AddNoticeForm';
import NoticesDashboard from '@/components/notices/NoticesDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

const NoticesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const isMobile = useIsMobile();
  
  return (
    <AppLayout title="Notices">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notice Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, publish, and manage notices for students, parents, and staff.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="dashboard">Notice Dashboard</TabsTrigger>
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="add">Add Notice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <NoticesDashboard />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <NoticesList />
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <AddNoticeForm />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default NoticesPage;
