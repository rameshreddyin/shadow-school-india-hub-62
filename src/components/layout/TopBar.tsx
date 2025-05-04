
import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, User, LogOut, Settings } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { Link } from 'react-router-dom';

// Import dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { toggle } = useSidebar();

  return (
    <header className="bg-white border-b border-gray-200 shadow-soft z-10 py-3 px-4 sm:px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggle}
            className="text-gray-600 hover:text-gray-900 focus:outline-none mr-4"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-1 rounded-full hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <span className="hidden md:block text-sm font-medium">
            Delhi Public School
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium">AD</span>
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center px-4 py-3 border-b border-gray-100">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@school.com</p>
                </div>
              </div>
              
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/login" className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
