import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import EditTeacherForm from '@/components/teachers/EditTeacherForm';
import { useToast } from '@/hooks/use-toast';
import { TeacherFormValues } from '@/schemas/teacher.schema';
import LoadingFallback from '@/components/LoadingFallback';

// Mock teacher data (in a real app, this would be fetched from your backend)
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
    gender: 'Male',
    address: '789 Literature Lane, Faculty Quarters, Bangalore',
    dob: new Date('1982-11-10'),
    joiningDate: new Date('2015-03-20'),
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
    gender: 'Female',
    address: '101 History Avenue, Teacher Colony, Chennai',
    dob: new Date('1987-04-25'),
    joiningDate: new Date('2016-08-05'),
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
    gender: 'Male',
    address: '202 Admin Block, School Campus, Hyderabad',
    dob: new Date('1975-09-30'),
    joiningDate: new Date('2008-01-15'),
  },
];

const EditTeacherPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find teacher by ID (in a real app, this would be a React Query or API fetch)
  const teacher = teachers.find(t => t.id === id);
  
  const handleSubmit = (data: TeacherFormValues) => {
    // In a real app, this would update the teacher in your backend
    console.log('Updated teacher data:', data);
    
    toast({
      title: 'Teacher Updated',
      description: `${data.name}'s information has been updated successfully.`,
    });
    
    // Redirect back to teacher details page
    navigate(`/teachers/${id}`);
  };
  
  // Handle case where teacher is not found
  if (!teacher) {
    navigate('/teachers');
    return null;
  }
  
  return (
    <AppLayout title={`Edit Teacher: ${teacher.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(`/teachers/${id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Teacher Profile</h1>
          </div>
        </div>
        
        {/* Edit Form */}
        <div className="rounded-md border bg-card p-6">
          <EditTeacherForm 
            teacher={teacher} 
            onSubmit={handleSubmit} 
            onCancel={() => navigate(`/teachers/${id}`)} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditTeacherPage;
