
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  isPresent: boolean;
}

// Mock data
const mockStudentData: Student[] = [
  { id: '1', name: 'Aditya Sharma', rollNumber: '001', class: '10th', section: 'A', isPresent: true },
  { id: '2', name: 'Priya Patel', rollNumber: '002', class: '10th', section: 'A', isPresent: true },
  { id: '3', name: 'Rahul Kumar', rollNumber: '003', class: '10th', section: 'A', isPresent: false },
  { id: '4', name: 'Neha Singh', rollNumber: '004', class: '10th', section: 'A', isPresent: true },
  { id: '5', name: 'Rohan Gupta', rollNumber: '005', class: '10th', section: 'B', isPresent: true },
  { id: '6', name: 'Anjali Verma', rollNumber: '006', class: '10th', section: 'B', isPresent: false },
  { id: '7', name: 'Vikram Malhotra', rollNumber: '007', class: '10th', section: 'B', isPresent: true },
  { id: '8', name: 'Meera Joshi', rollNumber: '008', class: '10th', section: 'B', isPresent: true },
  { id: '9', name: 'Arjun Kapoor', rollNumber: '009', class: '10th', section: 'C', isPresent: false },
  { id: '10', name: 'Divya Reddy', rollNumber: '010', class: '10th', section: 'C', isPresent: true },
];

const classes = ['All Classes', '10th', '9th', '8th', '7th', '6th'];
const sections = ['All Sections', 'A', 'B', 'C', 'D'];

const StudentAttendanceTab: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('All Classes');
  const [selectedSection, setSelectedSection] = useState<string>('All Sections');
  const [studentList, setStudentList] = useState<Student[]>(mockStudentData);
  const isMobile = useIsMobile();
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // In a real app, we would fetch student attendance for the selected date
      console.log('Fetching student attendance for', format(newDate, 'yyyy-MM-dd'));
      
      // For demo, we'll reset the attendance
      setStudentList(mockStudentData.map(student => ({ ...student, isPresent: Math.random() > 0.2 })));
    }
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
  };

  const handleToggleAttendance = (id: string, isPresent: boolean) => {
    setStudentList(prevList => 
      prevList.map(student => 
        student.id === id ? { ...student, isPresent } : student
      )
    );
  };

  const handleMarkAll = (status: boolean) => {
    setStudentList(prevList => 
      prevList.map(student => {
        const classMatch = selectedClass === 'All Classes' || student.class === selectedClass;
        const sectionMatch = selectedSection === 'All Sections' || student.section === selectedSection;
        
        return (classMatch && sectionMatch) ? { ...student, isPresent: status } : student;
      })
    );
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Student attendance saved successfully');
      
      // In a real app, we would save the attendance data to the backend
      console.log('Saving student attendance for', format(date, 'yyyy-MM-dd'), studentList);
    }, 1000);
  };

  const filteredStudents = studentList.filter(student => {
    const classMatch = selectedClass === 'All Classes' || student.class === selectedClass;
    const sectionMatch = selectedSection === 'All Sections' || student.section === selectedSection;
    return classMatch && sectionMatch;
  });

  const totalStudents = filteredStudents.length;
  const presentStudents = filteredStudents.filter(student => student.isPresent).length;
  const absentStudents = totalStudents - presentStudents;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-auto justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Select value={selectedClass} onValueChange={handleClassChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
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

          <Select value={selectedSection} onValueChange={handleSectionChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
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
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => handleMarkAll(true)}
          >
            <Check className="mr-1 h-4 w-4" /> Mark All Present
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => handleMarkAll(false)}
          >
            <X className="mr-1 h-4 w-4" /> Mark All Absent
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead className="text-right">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={cn(
                        "text-sm",
                        student.isPresent ? "text-green-500" : "text-red-500"
                      )}>
                        {student.isPresent ? "Present" : "Absent"}
                      </span>
                      <Switch
                        checked={student.isPresent}
                        onCheckedChange={(checked) => handleToggleAttendance(student.id, checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No students found with the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-semibold">{totalStudents}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="text-2xl font-semibold text-green-500">{presentStudents}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="text-2xl font-semibold text-red-500">{absentStudents}</p>
          </div>
        </div>
      </div>

      <div className={cn(
        "py-4 bg-background",
        isMobile ? "fixed bottom-0 left-0 right-0 border-t px-4 z-10" : ""
      )}>
        <Button 
          className="w-full sm:w-auto" 
          onClick={handleSaveAttendance}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>

      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default StudentAttendanceTab;
