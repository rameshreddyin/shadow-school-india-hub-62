import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, Mail, MapPin, Phone, User, Edit, Clock, Briefcase, Award } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
    responsibilities: 'Teaching Physics, Curriculum development, Lab management',
    workSchedule: 'Monday to Friday, 8:00 AM to 4:00 PM',
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

interface Day {
  id: string;
  label: string;
}

const weekDays: Day[] = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
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
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
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
          
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        
        {/* Staff Profile Card */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-4">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  {staff.photo ? (
                    <AvatarImage src={staff.photo} alt={staff.name} />
                  ) : (
                    <AvatarFallback className="text-3xl">{getInitials(staff.name)}</AvatarFallback>
                  )}
                </Avatar>
                
                <div className="space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold">{staff.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Staff ID: {staff.staffId}</span>
                      <span>•</span>
                      <span>{getPositionTitle()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{staff.department}</Badge>
                    <Badge variant="outline">{staff.qualification}</Badge>
                    <Badge variant="outline" className="capitalize">{staff.staffType}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{staff.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different sections of information */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="professional">Professional Info</TabsTrigger>
            <TabsTrigger value="salary">Salary & Schedule</TabsTrigger>
          </TabsList>
          
          {/* Personal Details Tab */}
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Detailed information about {staff.name}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Full Name</span>
                    <span className="font-medium">{staff.name}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <span className="font-medium">{staff.gender}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Date of Birth</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(staff.dob)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Email Address</span>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{staff.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Phone Number</span>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{staff.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Staff Type</span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{staff.staffType}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <span className="font-medium">{staff.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Professional Info Tab */}
          <TabsContent value="professional" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Professional details for {staff.name}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Position</span>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{getPositionTitle()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Department</span>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{staff.department}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Qualification</span>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{staff.qualification}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Joining Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(staff.joiningDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {!isTeacher && staff.responsibilities && (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Responsibilities</span>
                      <span className="font-medium">{staff.responsibilities}</span>
                    </div>
                  )}
                  
                  {staff.workSchedule && (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Work Schedule</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{staff.workSchedule}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Salary & Schedule Tab */}
          <TabsContent value="salary" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
                <CardDescription>Salary details and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>Monthly Salary</div>
                  <div className="text-xl font-semibold">₹{staff.salary.toLocaleString()}/month</div>
                </div>
                
                <Separator className="my-6" />
                
                <h4 className="font-medium mb-4">Weekly Work Schedule</h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekDays.slice(0, 5).map((day) => (
                        <TableRow key={day.id}>
                          <TableCell className="font-medium">{day.label}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Regular Working Hours</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {weekDays.slice(5).map((day) => (
                        <TableRow key={day.id}>
                          <TableCell className="font-medium">{day.label}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Off Day</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
