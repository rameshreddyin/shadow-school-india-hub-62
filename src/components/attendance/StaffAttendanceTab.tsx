
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, Filter, Check, X } from 'lucide-react';
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

interface StaffMember {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  isPresent: boolean;
}

// Mock data
const mockStaffData: StaffMember[] = [
  { id: '1', name: 'Rajesh Sharma', employeeId: 'EMP-001', role: 'Math Teacher', department: 'Teaching', isPresent: true },
  { id: '2', name: 'Priya Patel', employeeId: 'EMP-002', role: 'Science Teacher', department: 'Teaching', isPresent: true },
  { id: '3', name: 'Amit Kumar', employeeId: 'EMP-003', role: 'English Teacher', department: 'Teaching', isPresent: false },
  { id: '4', name: 'Sunita Verma', employeeId: 'EMP-004', role: 'History Teacher', department: 'Teaching', isPresent: true },
  { id: '5', name: 'Aarav Singh', employeeId: 'EMP-005', role: 'Librarian', department: 'Library', isPresent: true },
  { id: '6', name: 'Meera Gupta', employeeId: 'EMP-006', role: 'Administrative Assistant', department: 'Administration', isPresent: false },
  { id: '7', name: 'Vikram Malhotra', employeeId: 'EMP-007', role: 'Physical Education', department: 'Teaching', isPresent: true },
  { id: '8', name: 'Neha Joshi', employeeId: 'EMP-008', role: 'Art Teacher', department: 'Teaching', isPresent: true },
  { id: '9', name: 'Rahul Kapoor', employeeId: 'EMP-009', role: 'Security Officer', department: 'Security', isPresent: false },
  { id: '10', name: 'Deepika Reddy', employeeId: 'EMP-010', role: 'Accountant', department: 'Administration', isPresent: true },
];

const departments = ['All Departments', 'Teaching', 'Administration', 'Library', 'Security'];

const StaffAttendanceTab: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [department, setDepartment] = useState<string>('All Departments');
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaffData);
  const isMobile = useIsMobile();
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      // In a real app, we would fetch staff attendance for the selected date
      console.log('Fetching attendance for', format(newDate, 'yyyy-MM-dd'));
      
      // For demo, we'll reset the attendance
      setStaffList(mockStaffData.map(staff => ({ ...staff, isPresent: Math.random() > 0.2 })));
    }
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
  };

  const handleToggleAttendance = (id: string, isPresent: boolean) => {
    setStaffList(prevList => 
      prevList.map(staff => 
        staff.id === id ? { ...staff, isPresent } : staff
      )
    );
  };

  const handleMarkAll = (status: boolean) => {
    setStaffList(prevList => 
      prevList.map(staff => 
        department === 'All Departments' || staff.department === department
          ? { ...staff, isPresent: status }
          : staff
      )
    );
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Staff attendance saved successfully');
      
      // In a real app, we would save the attendance data to the backend
      console.log('Saving attendance for', format(date, 'yyyy-MM-dd'), staffList);
    }, 1000);
  };

  const filteredStaff = department === 'All Departments' 
    ? staffList 
    : staffList.filter(staff => staff.department === department);

  const totalStaff = filteredStaff.length;
  const presentStaff = filteredStaff.filter(staff => staff.isPresent).length;
  const absentStaff = totalStaff - presentStaff;

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

          <Select value={department} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
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
              <TableHead>Staff Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  <TableCell>{staff.employeeId}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={cn(
                        "text-sm",
                        staff.isPresent ? "text-green-500" : "text-red-500"
                      )}>
                        {staff.isPresent ? "Present" : "Absent"}
                      </span>
                      <Switch
                        checked={staff.isPresent}
                        onCheckedChange={(checked) => handleToggleAttendance(staff.id, checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No staff members found in this department.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-2xl font-semibold">{totalStaff}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="text-2xl font-semibold text-green-500">{presentStaff}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="text-2xl font-semibold text-red-500">{absentStaff}</p>
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

export default StaffAttendanceTab;
