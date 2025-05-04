
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  date: Date;
  totalStaff: number;
  presentStaff: number;
  absentStaff: number;
}

// Mock data
const mockAttendanceHistory: AttendanceRecord[] = [
  { id: '1', date: new Date(2024, 6, 10), totalStaff: 10, presentStaff: 8, absentStaff: 2 },
  { id: '2', date: new Date(2024, 6, 9), totalStaff: 10, presentStaff: 9, absentStaff: 1 },
  { id: '3', date: new Date(2024, 6, 8), totalStaff: 10, presentStaff: 7, absentStaff: 3 },
  { id: '4', date: new Date(2024, 6, 7), totalStaff: 10, presentStaff: 10, absentStaff: 0 },
  { id: '5', date: new Date(2024, 6, 6), totalStaff: 10, presentStaff: 8, absentStaff: 2 },
  { id: '6', date: new Date(2024, 6, 5), totalStaff: 10, presentStaff: 9, absentStaff: 1 },
  { id: '7', date: new Date(2024, 6, 4), totalStaff: 10, presentStaff: 6, absentStaff: 4 },
];

const StaffAttendanceHistory: React.FC = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<string>("7days");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceHistory);

  const handleDeleteRecord = (id: string) => {
    // In a real app, we would delete the record from the backend
    setAttendanceRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    toast({
      title: "Attendance record deleted",
      description: "The attendance record has been deleted successfully."
    });
  };

  const getFilteredRecords = (): AttendanceRecord[] => {
    // Filter records based on timeRange
    const now = new Date();
    
    switch (timeRange) {
      case "7days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return attendanceRecords.filter(record => record.date >= sevenDaysAgo);
      case "30days":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return attendanceRecords.filter(record => record.date >= thirtyDaysAgo);
      case "all":
        return attendanceRecords;
      default:
        return attendanceRecords;
    }
  };

  const filteredRecords = getFilteredRecords();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total Staff</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{format(record.date, "PPP")}</TableCell>
                  <TableCell>{record.totalStaff}</TableCell>
                  <TableCell className="text-green-500">{record.presentStaff}</TableCell>
                  <TableCell className="text-red-500">{record.absentStaff}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Attendance Record</DialogTitle>
                            <DialogDescription>
                              Edit staff attendance for {format(record.date, "PPP")}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p>This would open the attendance form pre-populated with data from this date.</p>
                            <p className="text-sm text-muted-foreground mt-2">In a real implementation, this would load the actual attendance records for editing.</p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button>Continue to Edit</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffAttendanceHistory;
