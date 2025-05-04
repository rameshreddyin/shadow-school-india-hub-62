
import React, { useState } from 'react';
import { Search, Edit, Eye, Trash2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddTeacherDialog from '@/components/teachers/AddTeacherDialog';

// Mock teacher data
const teachers = [
  {
    id: '1',
    name: 'Dr. Rahul Sharma',
    staffId: 'TCH001',
    department: 'Science',
    role: 'Head of Department',
    phone: '9876543210',
    email: 'rahul.sharma@school.edu',
    qualification: 'Ph.D. Physics',
    photo: '',
  },
  {
    id: '2',
    name: 'Priya Patel',
    staffId: 'TCH002',
    department: 'Mathematics',
    role: 'Senior Teacher',
    phone: '9876543211',
    email: 'priya.patel@school.edu',
    qualification: 'M.Sc. Mathematics',
    photo: '',
  },
  {
    id: '3',
    name: 'Anil Kumar',
    staffId: 'TCH003',
    department: 'Languages',
    role: 'Teacher',
    phone: '9876543212',
    email: 'anil.kumar@school.edu',
    qualification: 'M.A. English',
    photo: '',
  },
  {
    id: '4',
    name: 'Sunita Reddy',
    staffId: 'TCH004',
    department: 'Social Studies',
    role: 'Teacher',
    phone: '9876543213',
    email: 'sunita.reddy@school.edu',
    qualification: 'M.A. History',
    photo: '',
  },
  {
    id: '5',
    name: 'Rajesh Gupta',
    staffId: 'TCH005',
    department: 'Administration',
    role: 'Principal',
    phone: '9876543214',
    email: 'rajesh.gupta@school.edu',
    qualification: 'Ph.D. Education',
    photo: '',
  },
];

const departments = ['All Departments', 'Science', 'Mathematics', 'Languages', 'Social Studies', 'Arts', 'Physical Education', 'Administration'];
const roles = ['All Roles', 'Principal', 'Vice Principal', 'Head of Department', 'Senior Teacher', 'Teacher', 'Teaching Assistant', 'Administrative Staff'];
const sortOptions = ['Name A-Z', 'Name Z-A', 'Department', 'Role', 'Recently Added'];

const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedSort, setSelectedSort] = useState<string>('Name A-Z');
  const isMobile = useIsMobile();

  // Filter teachers based on search query, department, and role
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      teacher.staffId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || teacher.department === selectedDepartment;
    const matchesRole = selectedRole === 'All Roles' || teacher.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  // Sort teachers based on selected sort option
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (selectedSort) {
      case 'Name A-Z':
        return a.name.localeCompare(b.name);
      case 'Name Z-A':
        return b.name.localeCompare(a.name);
      case 'Department':
        return a.department.localeCompare(b.department);
      case 'Role':
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppLayout title="Teachers">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Teacher Management</h1>
          <AddTeacherDialog />
        </div>

        {/* Filters and Search */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or staff ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Teacher List - Table view for desktop, Card view for mobile */}
        {isMobile ? (
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="grid gap-4">
              {sortedTeachers.map((teacher) => (
                <Card key={teacher.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 border-b p-4">
                      <Avatar>
                        {teacher.photo ? (
                          <AvatarImage src={teacher.photo} alt={teacher.name} />
                        ) : (
                          <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Staff ID: {teacher.staffId}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Role</p>
                        <p className="font-medium">{teacher.role}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{teacher.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{teacher.phone}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-340px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {teacher.photo ? (
                              <AvatarImage src={teacher.photo} alt={teacher.name} />
                            ) : (
                              <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{teacher.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.staffId}</TableCell>
                      <TableCell>{teacher.role}</TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button size="icon" variant="ghost" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TeachersPage;
