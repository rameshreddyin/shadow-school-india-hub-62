import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Calendar, Award, Building, Briefcase,
  MapPin, Clock, BookOpen, Users, Edit
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import EditStaffDialog from '@/components/staff/EditStaffDialog';
import { useToast } from '@/hooks/use-toast';
import { devLog } from '@/utils/environment';

// Mock teacher data (in production would be fetched from API)
const teachers = [
  {
    id: '1',
    name: 'Dr. Rahul Sharma',
    employeeId: 'TCH001',
    staffId: 'TCH001',
    staffType: 'teacher' as const,
    department: 'Science',
    role: 'Head of Department',
    phone: '9876543210',
    email: 'rahul.sharma@school.edu',
    qualification: 'Ph.D. Physics',
    salary: 45000,
    photo: '',
    gender: 'male' as const,
    address: '123 Education Street, Academic Colony, New Delhi',
    dob: new Date('1980-05-15'),
    joinDate: new Date('2010-06-01'),
    joiningDate: new Date('2010-06-01'),
    subjects: [
      { subject: 'Physics', class: 'Class 11', section: 'A' },
      { subject: 'Physics', class: 'Class 12', section: 'A' },
      { subject: 'Science', class: 'Class 10', section: 'B' },
    ],
    availability: {
      monday: { available: true, from: '09:00', to: '15:00' },
      tuesday: { available: true, from: '09:00', to: '15:00' },
      wednesday: { available: true, from: '09:00', to: '15:00' },
      thursday: { available: true, from: '09:00', to: '15:00' },
      friday: { available: true, from: '09:00', to: '13:00' },
      saturday: { available: false, from: '', to: '' },
      sunday: { available: false, from: '', to: '' },
    }
  },
  {
    id: '2',
    name: 'Priya Patel',
    employeeId: 'TCH002',
    staffId: 'TCH002',
    staffType: 'teacher' as const,
    department: 'Mathematics',
    role: 'Senior Teacher',
    phone: '9876543211',
    email: 'priya.patel@school.edu',
    qualification: 'M.Sc. Mathematics',
    salary: 38000,
    photo: '',
    gender: 'female' as const,
    address: '456 Knowledge Park, Faculty Housing, Mumbai',
    dob: new Date('1985-03-22'),
    joinDate: new Date('2012-07-15'),
    joiningDate: new Date('2012-07-15'),
    subjects: [
      { subject: 'Mathematics', class: 'Class 9', section: 'A' },
      { subject: 'Mathematics', class: 'Class 10', section: 'A' },
      { subject: 'Mathematics', class: 'Class 8', section: 'B' },
    ],
    availability: {
      monday: { available: true, from: '08:30', to: '14:30' },
      tuesday: { available: true, from: '08:30', to: '14:30' },
      wednesday: { available: true, from: '08:30', to: '12:30' },
      thursday: { available: true, from: '08:30', to: '14:30' },
      friday: { available: true, from: '08:30', to: '14:30' },
      saturday: { available: false, from: '', to: '' },
      sunday: { available: false, from: '', to: '' },
    }
  },
  {
    id: '3',
    name: 'Anil Kumar',
    employeeId: 'TCH003',
    staffId: 'TCH003',
    staffType: 'teacher' as const,
    department: 'Languages',
    role: 'Teacher',
    phone: '9876543212',
    email: 'anil.kumar@school.edu',
    qualification: 'M.A. English',
    salary: 32000,
    photo: '',
    gender: 'male' as const,
    address: '789 Literature Lane, Faculty Quarters, Bangalore',
    dob: new Date('1982-11-10'),
    joinDate: new Date('2015-03-20'),
    joiningDate: new Date('2015-03-20'),
    subjects: [
      { subject: 'English', class: 'Class 6', section: 'A' },
      { subject: 'English', class: 'Class 7', section: 'B' },
      { subject: 'English', class: 'Class 8', section: 'A' },
    ],
    availability: {
      monday: { available: true, from: '09:30', to: '15:30' },
      tuesday: { available: true, from: '09:30', to: '15:30' },
      wednesday: { available: true, from: '09:30', to: '15:30' },
      thursday: { available: true, from: '09:30', to: '15:30' },
      friday: { available: true, from: '09:30', to: '13:30' },
      saturday: { available: false, from: '', to: '' },
      sunday: { available: false, from: '', to: '' },
    }
  },
  // ... other teachers
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

const TeacherInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
  // Find teacher data based on ID from params
  const teacher = teachers.find(t => t.id === id);
  
  // Redirect to teachers list if teacher not found
  if (!teacher) {
    React.useEffect(() => {
      toast({
        title: "Teacher Not Found",
        description: "The requested teacher profile could not be found.",
        variant: "destructive"
      });
      navigate('/teachers');
    }, [navigate, toast]);
    return null;
  }
  
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

  const handleEditTeacher = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    toast({
      title: "Profile Updated",
      description: `${teacher.name}'s profile has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
  };

  // Log page view for analytics (development only)
  React.useEffect(() => {
    devLog(`Viewed teacher profile: ${teacher.id} - ${teacher.name}`);
  }, [teacher]);

  return (
    <AppLayout title={`Teacher: ${teacher.name}`}>
      <div className="space-y-8">
        {/* Header with backlink and actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full shadow-sm"
              onClick={() => navigate('/teachers')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Teacher Profile</h1>
          </div>
          
          <Button 
            onClick={handleEditTeacher}
            className="rounded-full shadow-sm transition-all hover:shadow"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        
        {/* Profile Hero Section */}
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-white to-blue-50 shadow-md">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 blur-xl"></div>
                <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-lg">
                  {teacher.photo ? (
                    <AvatarImage src={teacher.photo} alt={teacher.name} />
                  ) : (
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{teacher.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-blue-50">ID: {teacher.staffId}</Badge>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {teacher.role}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500 hover:bg-blue-600">{teacher.department}</Badge>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50">{teacher.qualification}</Badge>
                </div>
                
                <div className="flex flex-wrap gap-6 pt-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-1.5">
                      <Mail className="h-4 w-4 text-blue-700" />
                    </div>
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-1.5">
                      <Phone className="h-4 w-4 text-blue-700" />
                    </div>
                    <span>{teacher.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections of information */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="subjects">Subjects & Classes</TabsTrigger>
            <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* Personal Details Tab */}
          <TabsContent value="details" className="mt-6">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Detailed information about {teacher.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                      <p className="font-medium">{teacher.name}</p>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                      <p className="font-medium">{teacher.gender}</p>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Calendar className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{formatDate(teacher.dob)}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Mail className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{teacher.email}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Phone className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{teacher.phone}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Briefcase className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{teacher.role}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Building className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{teacher.department}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Qualification</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Award className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{teacher.qualification}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Joining Date</h3>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5">
                          <Calendar className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{formatDate(teacher.joiningDate)}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-100 p-1.5 mt-0.5">
                          <MapPin className="h-4 w-4 text-blue-700" />
                        </div>
                        <p className="font-medium">{teacher.address}</p>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Subjects & Classes Tab */}
          <TabsContent value="subjects" className="mt-6">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
                <CardTitle>Assigned Subjects & Classes</CardTitle>
                <CardDescription>Subjects and classes taught by {teacher.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Students</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacher.subjects.map((subj, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-purple-100 p-1.5">
                                <BookOpen className="h-4 w-4 text-purple-700" />
                              </div>
                              {subj.subject}
                            </div>
                          </TableCell>
                          <TableCell>{subj.class}</TableCell>
                          <TableCell>{subj.section}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-purple-100 p-1.5">
                                <Users className="h-4 w-4 text-purple-700" />
                              </div>
                              <span>{Math.floor(Math.random() * 20) + 25}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Weekly Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
                <CardTitle>Weekly Availability Schedule</CardTitle>
                <CardDescription>Regular teaching hours for {teacher.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[150px]">Day</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekDays.map((day) => (
                        <TableRow key={day.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {day.label}
                          </TableCell>
                          <TableCell>
                            {teacher.availability[day.id as keyof typeof teacher.availability].available ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                                Not Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {teacher.availability[day.id as keyof typeof teacher.availability].available ? (
                              <div className="flex items-center gap-2">
                                <div className="rounded-full bg-green-100 p-1.5">
                                  <Clock className="h-4 w-4 text-green-700" />
                                </div>
                                <span>
                                  {teacher.availability[day.id as keyof typeof teacher.availability].from} - {teacher.availability[day.id as keyof typeof teacher.availability].to}
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-4">
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Teaching performance metrics and evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-amber-100 p-4 mb-4">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Performance Data Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    Performance data will be available after the next evaluation cycle. 
                    Check back later for detailed metrics and analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Teacher Dialog */}
      <EditStaffDialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        staff={teacher}
        onSubmit={handleEditSuccess}
      />
    </AppLayout>
  );
};

export default TeacherInfoPage;
