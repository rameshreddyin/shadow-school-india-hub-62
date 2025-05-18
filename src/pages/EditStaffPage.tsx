
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import EditStaffForm from '@/components/staff/EditStaffForm';
import { useToast } from '@/hooks/use-toast';
import { StaffFormValues } from '@/schemas/teacher.schema';
import LoadingFallback from '@/components/LoadingFallback';

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

const EditStaffPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find staff by ID (in a real app, this would be a React Query or API fetch)
  const staff = staffMembers.find(s => s.id === id);
  
  const handleSubmit = (data: StaffFormValues) => {
    // In a real app, this would update the staff in your backend
    console.log('Updated staff data:', data);
    
    toast({
      title: 'Staff Updated',
      description: `${data.name}'s information has been updated successfully.`,
    });
    
    // Redirect back to staff details page
    navigate(`/teachers/${id}`);
  };
  
  // Handle case where staff is not found
  if (!staff) {
    navigate('/teachers');
    return null;
  }
  
  return (
    <AppLayout title={`Edit Staff: ${staff.name}`}>
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
            <h1 className="text-2xl font-semibold tracking-tight">Edit Staff Profile</h1>
          </div>
        </div>
        
        {/* Edit Form */}
        <div className="space-y-6">
          <EditStaffForm 
            staff={staff} 
            onSubmit={handleSubmit} 
            onCancel={() => navigate(`/teachers/${id}`)} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditStaffPage;
