
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useSidebar } from './SidebarProvider';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
        isOpen ? 'lg:ml-64' : ''
      }`}>
        <TopBar title={title || 'Dashboard'} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
