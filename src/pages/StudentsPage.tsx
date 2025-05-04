import React, { useState } from 'react';
import { Search, Plus, User, Edit, Eye, Trash2 } from 'lucide-react';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddStudentDialog from '@/components/students/AddStudentDialog';

// Mock student data
const students = [
  {
    id: '1',
    name: 'Aarav Sharma',
    rollNumber: '2301',
    admissionNumber: 'ADM2023001',
    class: 'X',
    section: 'A',
    parentName: 'Vikram Sharma',
    status: 'Active',
    photo: '',
  },
  {
    id: '2',
    name: 'Diya Patel',
    rollNumber: '2302',
    admissionNumber: 'ADM2023002',
    class: 'X',
    section: 'A',
    parentName: 'Raj Patel',
    status: 'Active',
    photo: '',
  },
  {
    id: '3',
    name: 'Arjun Singh',
    rollNumber: '2303',
    admissionNumber: 'ADM2023003',
    class: 'IX',
    section: 'B',
    parentName: 'Manpreet Singh',
    status: 'Active',
    photo: '',
  },
  {
    id: '4',
    name: 'Ananya Kumar',
    rollNumber: '2304',
    admissionNumber: 'ADM2023004',
    class: 'VIII',
    section: 'C',
    parentName: 'Rajesh Kumar',
    status: 'Left',
    photo: '',
  },
  {
    id: '5',
    name: 'Rohit Verma',
    rollNumber: '2305',
    admissionNumber: 'ADM2023005',
    class: 'VII',
    section: 'A',
    parentName: 'Sanjay Verma',
    status: 'Active',
    photo: '',
  },
];

const classes = ['All Classes', 'XII', 'XI', 'X', 'IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
const sections = ['All Sections', 'A', 'B', 'C', 'D'];

const StudentsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('All Classes');
  const [selectedSection, setSelectedSection] = useState<string>('All Sections');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isMobile = useIsMobile();

  // Filter students based on class, section, and search query
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    const matchesSection = selectedSection === 'All Sections' || student.section === selectedSection;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClass && matchesSection && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppLayout title="Students">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Student List</h1>
          <AddStudentDialog />
        </div>

        {/* Filters and Search */}
        <div className="grid gap-4 md:grid-cols-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or admission number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Student List - Table view for desktop, Card view for mobile */}
        {isMobile ? (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 border-b p-4">
                      <Avatar>
                        {student.photo ? (
                          <AvatarImage src={student.photo} alt={student.name} />
                        ) : (
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Roll: {student.rollNumber} | Adm: {student.admissionNumber}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Class & Section</p>
                        <p className="font-medium">
                          {student.class} - {student.section}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Parent</p>
                        <p className="font-medium">{student.parentName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
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
            <ScrollArea className="h-[calc(100vh-280px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Class & Section</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {student.photo ? (
                              <AvatarImage src={student.photo} alt={student.name} />
                            ) : (
                              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.admissionNumber}</TableCell>
                      <TableCell>
                        {student.class} - {student.section}
                      </TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </TableCell>
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

export default StudentsPage;
