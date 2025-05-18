
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import EditStaffDialog from '@/components/staff/EditStaffDialog';

// Mock staff data (in a real app, this would be fetched from your backend)
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

const StaffInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  // Find staff member by ID
  const staff = staffMembers.find(s => s.id === id);
  
  if (!staff) {
    navigate('/teachers');
    return null;
  }
  
  const isTeacher = staff.staffType === 'teacher';
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = () => {
    // In a real app, this would delete the staff member from your backend
    toast({
      title: 'Staff Removed',
      description: `${staff.name} has been removed successfully.`,
    });
    
    navigate('/teachers');
  };
  
  const getPositionTitle = () => {
    if (isTeacher) {
      return staff.role;
    } else {
      return staff.jobTitle;
    }
  };
  
  return (
    <AppLayout title={`Staff: ${staff.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/teachers')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">Staff Profile</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Staff Profile */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Personal Info */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="h-32 w-32">
                  {staff.photo ? (
                    <AvatarImage src={staff.photo} alt={staff.name} />
                  ) : (
                    <AvatarFallback className="text-4xl">{getInitials(staff.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{staff.name}</h2>
                  <p className="text-muted-foreground">{getPositionTitle()}</p>
                  <p className="text-sm text-muted-foreground">ID: {staff.staffId}</p>
                </div>
                <div className="w-full pt-4">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          Email
                        </TableCell>
                        <TableCell className="text-right">{staff.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          Phone
                        </TableCell>
                        <TableCell className="text-right">{staff.phone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          Department
                        </TableCell>
                        <TableCell className="text-right">{staff.department}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          Address
                        </TableCell>
                        <TableCell className="text-right text-sm">{staff.address}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Right Column - Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="salary">Salary</TabsTrigger>
              </TabsList>
              
              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{staff.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p>{staff.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p>{staff.dob ? format(staff.dob, 'PPP') : 'Not Available'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Staff Type</p>
                        <p className="capitalize">{staff.staffType}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Position</p>
                        <p>{getPositionTitle()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Qualification</p>
                        <p>{staff.qualification}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p>{staff.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Joining Date</p>
                        <p>{staff.joiningDate ? format(staff.joiningDate, 'PPP') : 'Not Available'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
                    <div className="space-y-4">
                      {isTeacher ? (
                        <p>Teacher's schedule information would appear here.</p>
                      ) : (
                        <p>Staff member's work schedule information would appear here.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Salary Tab */}
              <TabsContent value="salary" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Salary Information</h3>
                      <div className="text-xl font-semibold">₹{staff.salary.toLocaleString()}/month</div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h4 className="font-medium mb-4">Payment History</h4>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Salary payment history will be displayed here.</p>
                      <p className="text-sm">You can view detailed payment records in the salary management section.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Edit Staff Dialog */}
      <EditStaffDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        staff={staff}
      />
    </AppLayout>
  );
};

export default StaffInfoPage;
