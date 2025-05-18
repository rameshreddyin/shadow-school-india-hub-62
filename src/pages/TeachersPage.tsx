
import React, { useState } from 'react';
import { Search, Edit, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import AddStaffDialog from '@/components/teachers/AddStaffDialog';
import EditTeacherDialog from '@/components/teachers/EditTeacherDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock staff data
const staffMembers = [
  {
    id: '1',
    name: 'Dr. Rahul Sharma',
    staffId: 'TCH001',
    staffType: 'teacher',
    department: 'Science',
    role: 'Head of Department',
    jobTitle: '',
    phone: '9876543210',
    email: 'rahul.sharma@school.edu',
    qualification: 'Ph.D. Physics',
    salary: 45000,
    photo: '',
    gender: 'Male',
    address: '123 Education Street, Academic Colony, New Delhi',
    dob: new Date('1980-05-15'),
    joiningDate: new Date('2010-06-01'),
  },
  {
    id: '2',
    name: 'Priya Patel',
    staffId: 'TCH002',
    staffType: 'teacher',
    department: 'Mathematics',
    role: 'Senior Teacher',
    jobTitle: '',
    phone: '9876543211',
    email: 'priya.patel@school.edu',
    qualification: 'M.Sc. Mathematics',
    salary: 38000,
    photo: '',
    gender: 'Female',
    address: '456 Knowledge Park, Faculty Housing, Mumbai',
    dob: new Date('1985-03-22'),
    joiningDate: new Date('2012-07-15'),
  },
  {
    id: '3',
    name: 'Anil Kumar',
    staffId: 'TCH003',
    staffType: 'teacher',
    department: 'Languages',
    role: 'Teacher',
    jobTitle: '',
    phone: '9876543212',
    email: 'anil.kumar@school.edu',
    qualification: 'M.A. English',
    salary: 32000,
    photo: '',
    gender: 'Male',
    address: '789 Literature Lane, Faculty Quarters, Bangalore',
    dob: new Date('1982-11-10'),
    joiningDate: new Date('2015-03-20'),
  },
  {
    id: '4',
    name: 'Meena Singh',
    staffId: 'ADM001',
    staffType: 'administrative',
    department: 'Administration',
    role: '',
    jobTitle: 'Office Manager',
    phone: '9876543215',
    email: 'meena.singh@school.edu',
    qualification: 'B.Com, MBA',
    salary: 35000,
    photo: '',
    gender: 'Female',
    address: '45 Court Lane, Mayur Vihar, New Delhi',
    dob: new Date('1983-06-22'),
    joiningDate: new Date('2018-04-12'),
  },
  {
    id: '5',
    name: 'Ravi Desai',
    staffId: 'FIN001',
    staffType: 'finance',
    department: 'Finance',
    role: '',
    jobTitle: 'Accountant',
    phone: '9876543216',
    email: 'ravi.desai@school.edu',
    qualification: 'CA',
    salary: 42000,
    photo: '',
    gender: 'Male',
    address: '123 Finance Block, Green Park, Mumbai',
    dob: new Date('1985-09-18'),
    joiningDate: new Date('2019-01-15'),
  },
];

const departments = ['All Departments', 'Science', 'Mathematics', 'Languages', 'Social Studies', 'Arts', 'Physical Education', 'Administration', 'Finance', 'Security', 'Housekeeping'];
const staffTypes = ['All Types', 'teacher', 'administrative', 'finance', 'housekeeping', 'security', 'other'];
const roles = ['All Roles', 'Principal', 'Vice Principal', 'Head of Department', 'Senior Teacher', 'Teacher', 'Teaching Assistant', 'Administrative Staff'];
const sortOptions = ['Name A-Z', 'Name Z-A', 'Department', 'Role', 'Recently Added'];

const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [selectedStaffType, setSelectedStaffType] = useState<string>('All Types');
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedSort, setSelectedSort] = useState<string>('Name A-Z');
  const [selectedStaff, setSelectedStaff] = useState<typeof staffMembers[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filter staff based on search query, department, type, and role
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      staff.staffId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || staff.department === selectedDepartment;
    const matchesStaffType = selectedStaffType === 'All Types' || staff.staffType === selectedStaffType;
    const matchesRole = selectedRole === 'All Roles' || 
                       (staff.staffType === 'teacher' && staff.role === selectedRole) ||
                       (staff.staffType !== 'teacher' && selectedRole === 'Administrative Staff');
    
    return matchesSearch && matchesDepartment && matchesStaffType && matchesRole;
  });

  // Sort staff based on selected sort option
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    switch (selectedSort) {
      case 'Name A-Z':
        return a.name.localeCompare(b.name);
      case 'Name Z-A':
        return b.name.localeCompare(a.name);
      case 'Department':
        return a.department.localeCompare(b.department);
      case 'Role':
        if (a.staffType === 'teacher' && b.staffType === 'teacher') {
          return a.role.localeCompare(b.role);
        } else if (a.staffType === 'teacher') {
          return -1;
        } else if (b.staffType === 'teacher') {
          return 1;
        } else {
          return a.jobTitle.localeCompare(b.jobTitle);
        }
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
  
  const handleViewStaff = (id: string) => {
    navigate(`/teachers/${id}`);
  };
  
  const handleEditStaff = (staff: typeof staffMembers[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteStaff = (staff: typeof staffMembers[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteStaff = () => {
    // In a real app, this would delete the staff from your backend
    toast({
      title: 'Staff Removed',
      description: `${selectedStaff?.name} has been removed successfully.`,
    });
    setIsDeleteDialogOpen(false);
  };

  // Get role or job title depending on staff type
  const getPosition = (staff: typeof staffMembers[0]) => {
    return staff.staffType === 'teacher' ? staff.role : staff.jobTitle;
  };

  return (
    <AppLayout title="Staff">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Staff Management</h1>
          <AddStaffDialog />
        </div>

        {/* Filters and Search */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or staff ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedStaffType} onValueChange={setSelectedStaffType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Staff Type" />
            </SelectTrigger>
            <SelectContent>
              {staffTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'teacher' ? 'Teaching Staff' : 
                   type === 'administrative' ? 'Administrative Staff' :
                   type === 'finance' ? 'Finance Staff' :
                   type === 'housekeeping' ? 'Housekeeping Staff' :
                   type === 'security' ? 'Security Staff' :
                   type === 'other' ? 'Other Staff' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

        {/* Staff List - Table view for desktop, Card view for mobile */}
        {isMobile ? (
          <ScrollArea className="h-[calc(100vh-340px)]">
            <div className="grid gap-4">
              {sortedStaff.map((staff) => (
                <Card key={staff.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 border-b p-4">
                      <Avatar>
                        {staff.photo ? (
                          <AvatarImage src={staff.photo} alt={staff.name} />
                        ) : (
                          <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{staff.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Staff ID: {staff.staffId}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Position</p>
                        <p className="font-medium">{getPosition(staff)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{staff.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{staff.phone}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleViewStaff(staff.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={(e) => handleEditStaff(staff, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={(e) => handleDeleteStaff(staff, e)}
                        >
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
                    <TableHead>Name</TableHead>
                    <TableHead>Staff ID</TableHead>
                    <TableHead>Staff Type</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStaff.map((staff) => (
                    <TableRow key={staff.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewStaff(staff.id)}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {staff.photo ? (
                              <AvatarImage src={staff.photo} alt={staff.name} />
                            ) : (
                              <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.staffId}</TableCell>
                      <TableCell>
                        {staff.staffType === 'teacher' ? 'Teaching' : 
                         staff.staffType === 'administrative' ? 'Administrative' :
                         staff.staffType === 'finance' ? 'Finance' :
                         staff.staffType === 'housekeeping' ? 'Housekeeping' :
                         staff.staffType === 'security' ? 'Security' :
                         'Other'}
                      </TableCell>
                      <TableCell>{getPosition(staff)}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>{staff.phone}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="View" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewStaff(staff.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="Edit" 
                            onClick={(e) => handleEditStaff(staff, e)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            title="Delete" 
                            onClick={(e) => handleDeleteStaff(staff, e)}
                          >
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

      {/* Edit Staff Dialog */}
      <EditTeacherDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        teacher={selectedStaff} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedStaff?.name}'s record
              and remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStaff} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default TeachersPage;
