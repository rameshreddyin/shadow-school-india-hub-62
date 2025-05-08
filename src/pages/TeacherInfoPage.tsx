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

// Mock teacher data (in production would be fetched from API)
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
    gender: 'Male',
    address: '123 Education Street, Academic Colony, New Delhi',
    dob: new Date('1980-05-15'),
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
    staffId: 'TCH002',
    department: 'Mathematics',
    role: 'Senior Teacher',
    phone: '9876543211',
    email: 'priya.patel@school.edu',
    qualification: 'M.Sc. Mathematics',
    photo: '',
    gender: 'Female',
    address: '456 Knowledge Park, Faculty Housing, Mumbai',
    dob: new Date('1985-03-22'),
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
  
  // Find teacher data based on ID from params
  const teacher = teachers.find(t => t.id === id);
  
  // Redirect to teachers list if teacher not found
  if (!teacher) {
    navigate('/teachers');
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
    navigate(`/teachers/edit/${id}`);
  };

  return (
    <AppLayout title={`Teacher: ${teacher.name}`}>
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
            <h1 className="text-2xl font-semibold tracking-tight">Teacher Profile</h1>
          </div>
          
          <Button onClick={handleEditTeacher}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        
        {/* Profile Card */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-4">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  {teacher.photo ? (
                    <AvatarImage src={teacher.photo} alt={teacher.name} />
                  ) : (
                    <AvatarFallback className="text-3xl">{getInitials(teacher.name)}</AvatarFallback>
                  )}
                </Avatar>
                
                <div className="space-y-2">
                  <div>
                    <h2 className="text-2xl font-bold">{teacher.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Staff ID: {teacher.staffId}</span>
                      <span>•</span>
                      <span>{teacher.role}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{teacher.department}</Badge>
                    <Badge variant="outline">{teacher.qualification}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{teacher.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Detailed information about {teacher.name}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Full Name</span>
                    <span className="font-medium">{teacher.name}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Gender</span>
                    <span className="font-medium">{teacher.gender}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Date of Birth</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(teacher.dob)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Email Address</span>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Phone Number</span>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.role}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Department</span>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.department}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Qualification</span>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{teacher.qualification}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Joining Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(teacher.joiningDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <span className="font-medium">{teacher.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Subjects & Classes Tab */}
          <TabsContent value="subjects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Subjects & Classes</CardTitle>
                <CardDescription>Subjects and classes taught by {teacher.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.subjects.map((subj, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            {subj.subject}
                          </div>
                        </TableCell>
                        <TableCell>{subj.class}</TableCell>
                        <TableCell>{subj.section}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{Math.floor(Math.random() * 20) + 25}</span> {/* Mock data */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Weekly Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability Schedule</CardTitle>
                <CardDescription>Regular teaching hours for {teacher.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Day</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekDays.map((day) => (
                        <TableRow key={day.id}>
                          <TableCell className="font-medium">
                            {day.label}
                          </TableCell>
                          <TableCell>
                            {teacher.availability[day.id as keyof typeof teacher.availability].available ? (
                              <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                                Not Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {teacher.availability[day.id as keyof typeof teacher.availability].available ? (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
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
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Teaching performance metrics and evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Performance data will be available after the next evaluation cycle</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TeacherInfoPage;
