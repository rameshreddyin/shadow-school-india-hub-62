
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Check, X, ChevronDown } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  admissionNo: string;
  isPresent: boolean;
}

// Mock data for demonstration
const classList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const sectionList = ['A', 'B', 'C', 'D'];

// Mock student data generator
const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `student-${index + 1}`,
    name: `Student ${index + 1}`,
    admissionNo: `ADM-${2023000 + index + 1}`,
    isPresent: false
  }));
};

const AttendancePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Load students when both class and section are selected
  React.useEffect(() => {
    if (selectedClass && selectedSection) {
      // In a real app, fetch students from API based on class and section
      const studentCount = Math.floor(Math.random() * 20) + 15; // Random between 15 and 35
      setStudents(generateStudents(studentCount));
    } else {
      setStudents([]);
    }
  }, [selectedClass, selectedSection]);
  
  const formattedDate = format(selectedDate, 'dd MMM yyyy');
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  
  const handleToggleAttendance = (studentId: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId ? { ...student, isPresent: !student.isPresent } : student
      )
    );
  };
  
  const markAllPresent = () => {
    setStudents(prevStudents => 
      prevStudents.map(student => ({ ...student, isPresent: true }))
    );
  };
  
  const markAllAbsent = () => {
    setStudents(prevStudents => 
      prevStudents.map(student => ({ ...student, isPresent: false }))
    );
  };
  
  const saveAttendance = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Attendance Saved",
        description: `Attendance for Class ${selectedClass}-${selectedSection} on ${formattedDate} has been saved successfully.`,
      });
    }, 1000);
  };
  
  return (
    <AppLayout title="Attendance">
      <div className="flex flex-col h-full">
        {/* Filters section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="class-select" className="block text-sm font-medium mb-1">
              Select Class
            </label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class-select" className="w-full">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classList.map(cls => (
                  <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="section-select" className="block text-sm font-medium mb-1">
              Select Section
            </label>
            <Select 
              value={selectedSection} 
              onValueChange={setSelectedSection}
              disabled={!selectedClass}
            >
              <SelectTrigger id="section-select" className="w-full">
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sectionList.map(section => (
                  <SelectItem key={section} value={section}>Section {section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="date-picker" className="block text-sm font-medium mb-1">
              Select Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {(selectedClass && selectedSection) ? (
          <>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-xl font-semibold">
                  Class {selectedClass}-{selectedSection} Attendance
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isToday ? 'Today: ' : 'Date: '}{formattedDate}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllPresent}
                  disabled={students.length === 0}
                  className="flex items-center"
                >
                  <Check className="mr-1 h-4 w-4" /> Mark All Present
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAbsent}
                  disabled={students.length === 0}
                  className="flex items-center"
                >
                  <X className="mr-1 h-4 w-4" /> Mark All Absent
                </Button>
              </div>
            </div>
            
            {/* Desktop view: Table */}
            <div className="hidden md:block flex-grow overflow-auto mb-16">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead className="text-center">Present / Absent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.admissionNo}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-4">
                          <Switch
                            checked={student.isPresent}
                            onCheckedChange={() => handleToggleAttendance(student.id)}
                          />
                          <span className="text-sm">
                            {student.isPresent ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile view: Cards */}
            <div className="md:hidden flex-grow overflow-auto mb-16">
              <div className="space-y-3">
                {students.map((student, index) => (
                  <Card key={student.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.admissionNo}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={student.isPresent}
                            onCheckedChange={() => handleToggleAttendance(student.id)}
                          />
                          <span className="text-sm min-w-16">
                            {student.isPresent ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Sticky footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-center lg:ml-64">
              <Button 
                onClick={saveAttendance}
                disabled={isSaving || students.length === 0}
                className="w-full max-w-md"
              >
                {isSaving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center p-8 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-medium mb-2">No Data to Display</h3>
              <p className="text-muted-foreground">
                Please select both class and section to view and mark attendance.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
