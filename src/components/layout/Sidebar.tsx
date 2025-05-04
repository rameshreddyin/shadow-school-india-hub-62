
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import { 
  LayoutDashboard, Users, User, CalendarCheck, 
  Calendar, FileText, Bell, Settings, X, Columns, Book 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { isOpen, close } = useSidebar();
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: Users, 
      label: 'Students', 
      path: '/students' 
    },
    { 
      icon: User, 
      label: 'Teachers', 
      path: '/teachers' 
    },
    {
      icon: Columns,
      label: 'Class & Section Manager',
      path: '/class-section-manager'
    },
    {
      icon: Book,
      label: 'Course & Subject Manager',
      path: '/course-subject-manager'
    },
    { 
      icon: CalendarCheck, 
      label: 'Attendance', 
      path: '/attendance' 
    },
    { 
      icon: Calendar, 
      label: 'Timetable', 
      path: '/timetable' 
    },
    { 
      icon: Calendar, 
      label: 'Fees', 
      path: '/fees' 
    },
    { 
      icon: FileText, 
      label: 'Reports', 
      path: '/reports' 
    },
    { 
      icon: Bell, 
      label: 'Notices', 
      path: '/notices' 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings' 
    }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col shadow-medium`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-sidebar-accent border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-sidebar-primary">Vidya SMS</span>
          </Link>
          
          <button 
            onClick={close}
            className="p-1 rounded-full hover:bg-sidebar-border lg:hidden"
          >
            <X size={20} className="text-sidebar-foreground" />
          </button>
        </div>
        
        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                    }`}
                    onClick={() => {
                      // Close sidebar on mobile when menu item is clicked
                      if (window.innerWidth < 1024) {
                        close();
                      }
                    }}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-medium">AD</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70">admin@school.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
