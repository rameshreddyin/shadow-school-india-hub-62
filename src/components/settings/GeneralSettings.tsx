
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchoolInfoSettings from './SchoolInfoSettings';
import WorkingDaysSettings from './WorkingDaysSettings';
import RoleAccessSettings from './RoleAccessSettings';
import UserLoginSettings from './UserLoginSettings';

const GeneralSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("schoolInfo");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage your school's general settings and configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="schoolInfo">School Info</TabsTrigger>
            <TabsTrigger value="workingDays">Working Days</TabsTrigger>
            <TabsTrigger value="roleAccess">Role Access</TabsTrigger>
            <TabsTrigger value="userLogin">User Login</TabsTrigger>
          </TabsList>
          
          <div className="px-6 pb-6">
            <TabsContent value="schoolInfo">
              <SchoolInfoSettings />
            </TabsContent>
            
            <TabsContent value="workingDays">
              <WorkingDaysSettings />
            </TabsContent>
            
            <TabsContent value="roleAccess">
              <RoleAccessSettings />
            </TabsContent>
            
            <TabsContent value="userLogin">
              <UserLoginSettings />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
