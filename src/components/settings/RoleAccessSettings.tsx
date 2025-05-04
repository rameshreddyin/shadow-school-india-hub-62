
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  permissions: {[key: string]: boolean};
}

// Sample data for demonstration
const permissionList: Permission[] = [
  // Students
  { id: 'view_students', name: 'View Students', description: 'Can view student records', category: 'Students' },
  { id: 'add_students', name: 'Add Students', description: 'Can add new student records', category: 'Students' },
  { id: 'edit_students', name: 'Edit Students', description: 'Can edit student records', category: 'Students' },
  { id: 'delete_students', name: 'Delete Students', description: 'Can delete student records', category: 'Students' },
  
  // Teachers
  { id: 'view_teachers', name: 'View Teachers', description: 'Can view teacher records', category: 'Teachers' },
  { id: 'add_teachers', name: 'Add Teachers', description: 'Can add new teacher records', category: 'Teachers' },
  { id: 'edit_teachers', name: 'Edit Teachers', description: 'Can edit teacher records', category: 'Teachers' },
  { id: 'delete_teachers', name: 'Delete Teachers', description: 'Can delete teacher records', category: 'Teachers' },
  
  // Attendance
  { id: 'view_attendance', name: 'View Attendance', description: 'Can view attendance records', category: 'Attendance' },
  { id: 'manage_attendance', name: 'Manage Attendance', description: 'Can manage attendance records', category: 'Attendance' },
  
  // Fees
  { id: 'view_fees', name: 'View Fees', description: 'Can view fee records', category: 'Fees' },
  { id: 'manage_fees', name: 'Manage Fees', description: 'Can manage fee records', category: 'Fees' },
  
  // Reports
  { id: 'view_reports', name: 'View Reports', description: 'Can view reports', category: 'Reports' },
  { id: 'generate_reports', name: 'Generate Reports', description: 'Can generate reports', category: 'Reports' },
  
  // Settings
  { id: 'view_settings', name: 'View Settings', description: 'Can view settings', category: 'Settings' },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Can manage settings', category: 'Settings' },
];

const roleList: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: {
      view_students: true,
      add_students: true,
      edit_students: true,
      delete_students: true,
      view_teachers: true,
      add_teachers: true,
      edit_teachers: true,
      delete_teachers: true,
      view_attendance: true,
      manage_attendance: true,
      view_fees: true,
      manage_fees: true,
      view_reports: true,
      generate_reports: true,
      view_settings: true,
      manage_settings: true,
    }
  },
  {
    id: 'teacher',
    name: 'Teacher',
    permissions: {
      view_students: true,
      add_students: false,
      edit_students: false,
      delete_students: false,
      view_teachers: true,
      add_teachers: false,
      edit_teachers: false,
      delete_teachers: false,
      view_attendance: true,
      manage_attendance: true,
      view_fees: true,
      manage_fees: false,
      view_reports: true,
      generate_reports: true,
      view_settings: false,
      manage_settings: false,
    }
  },
  {
    id: 'accountant',
    name: 'Accountant',
    permissions: {
      view_students: true,
      add_students: false,
      edit_students: false,
      delete_students: false,
      view_teachers: false,
      add_teachers: false,
      edit_teachers: false,
      delete_teachers: false,
      view_attendance: false,
      manage_attendance: false,
      view_fees: true,
      manage_fees: true,
      view_reports: true,
      generate_reports: true,
      view_settings: false,
      manage_settings: false,
    }
  },
  {
    id: 'student',
    name: 'Student',
    permissions: {
      view_students: false,
      add_students: false,
      edit_students: false,
      delete_students: false,
      view_teachers: false,
      add_teachers: false,
      edit_teachers: false,
      delete_teachers: false,
      view_attendance: false,
      manage_attendance: false,
      view_fees: false,
      manage_fees: false,
      view_reports: false,
      generate_reports: false,
      view_settings: false,
      manage_settings: false,
    }
  },
];

// Group permissions by category
const groupedPermissions = permissionList.reduce((acc, permission) => {
  if (!acc[permission.category]) {
    acc[permission.category] = [];
  }
  acc[permission.category].push(permission);
  return acc;
}, {} as {[key: string]: Permission[]});

const RoleAccessSettings: React.FC = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    // In a real app, we would save the data to the server
    toast({
      title: "Settings Saved",
      description: "Role permissions have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        This matrix shows default permissions for each role in the system. These permissions control what actions users with specific roles can perform.
      </p>
      
      <div className="overflow-x-auto">
        <Table className="border">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="font-bold text-center sticky left-0 bg-background">Permission / Role</TableHead>
              {roleList.map(role => (
                <TableHead key={role.id} className="text-center font-bold">{role.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <React.Fragment key={category}>
                <TableRow className="bg-muted/40">
                  <TableCell colSpan={roleList.length + 1} className="font-semibold sticky left-0">
                    {category}
                  </TableCell>
                </TableRow>
                {permissions.map(permission => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium text-sm sticky left-0 bg-background">
                      <div>{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </TableCell>
                    {roleList.map(role => (
                      <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                        {role.permissions[permission.id] ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a simplified view showing default permissions per role. Advanced role management including custom roles and detailed permission settings will be available in a future update.
        </p>
      </div>
    </div>
  );
};

export default RoleAccessSettings;
