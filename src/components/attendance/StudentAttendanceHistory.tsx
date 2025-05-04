
import React from 'react';
import { format, subDays } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: Date;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
}

// Mock data
const mockAttendanceHistory: AttendanceRecord[] = [
  { id: '1', date: new Date(), totalStudents: 120, presentStudents: 110, absentStudents: 10 },
  { id: '2', date: subDays(new Date(), 1), totalStudents: 120, presentStudents: 115, absentStudents: 5 },
  { id: '3', date: subDays(new Date(), 2), totalStudents: 120, presentStudents: 108, absentStudents: 12 },
  { id: '4', date: subDays(new Date(), 3), totalStudents: 120, presentStudents: 112, absentStudents: 8 },
  { id: '5', date: subDays(new Date(), 4), totalStudents: 120, presentStudents: 105, absentStudents: 15 },
];

const StudentAttendanceHistory: React.FC = () => {
  const handleEditAttendance = (id: string) => {
    console.log('Edit attendance record', id);
    // In a real app, this would navigate to the attendance editing interface
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead className="text-center">Present</TableHead>
              <TableHead className="text-center">Absent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAttendanceHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {format(record.date, 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{record.totalStudents}</TableCell>
                <TableCell className="text-center text-green-500">
                  {record.presentStudents} 
                  <span className="text-muted-foreground text-xs ml-1">
                    ({Math.round((record.presentStudents / record.totalStudents) * 100)}%)
                  </span>
                </TableCell>
                <TableCell className="text-center text-red-500">
                  {record.absentStudents}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({Math.round((record.absentStudents / record.totalStudents) * 100)}%)
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAttendance(record.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentAttendanceHistory;
