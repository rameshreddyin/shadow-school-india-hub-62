
import React from 'react';
import { Pencil, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Timetable, Period } from '@/types/timetable';

interface TimetableGridProps {
  timetable: Timetable;
  onEditPeriod: (day: string, slot: string) => void;
  onClearPeriod: (day: string, slot: string) => void;
  onAddPeriod: (day: string, slot: string) => void;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ 
  timetable, 
  onEditPeriod, 
  onClearPeriod,
  onAddPeriod
}) => {
  // Get days and time slots from timetable
  const days = Object.keys(timetable.days);
  
  // Get all unique time slot IDs across all days
  const timeSlotIds = new Set<string>();
  days.forEach(day => {
    Object.keys(timetable.days[day].slots).forEach(slotId => {
      timeSlotIds.add(slotId);
    });
  });
  
  // Convert to array and sort
  const timeSlots = Array.from(timeSlotIds).sort((a, b) => {
    const slotA = a.split('-')[0];
    const slotB = b.split('-')[0];
    return parseInt(slotA) - parseInt(slotB);
  });
  
  // Helper function to get time slot label
  const getTimeSlotLabel = (slotId: string) => {
    // Find any period that uses this slot to get the label
    for (const day of days) {
      const period = timetable.days[day].slots[slotId];
      if (period && period.timeSlot) {
        return `${period.timeSlot.startTime} - ${period.timeSlot.endTime}`;
      }
    }
    
    // If no period found with this slot, generate a generic label
    const [number] = slotId.split('-');
    return `Period ${number}`;
  };
  
  // Helper function to render period cell content
  const renderPeriodCell = (period: Period | null, day: string, slot: string) => {
    if (!period) {
      return (
        <div className="flex h-full items-center justify-center py-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground"
            onClick={() => onAddPeriod(day, slot)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Period</span>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="p-2 h-full flex flex-col">
        <div className="font-medium text-sm">{period.subject.name}</div>
        <div className="text-xs text-muted-foreground">{period.teacher.name}</div>
        <div className="mt-auto flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onEditPeriod(day, slot)}
          >
            <Pencil className="h-3 w-3" />
            <span className="sr-only">Edit Period</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onClearPeriod(day, slot)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove Period</span>
          </Button>
        </div>
      </div>
    );
  };
  
  const getDayName = (day: string): string => {
    const dayMap: Record<string, string> = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    };
    return dayMap[day] || day;
  };

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px]">Time</TableHead>
            {days.map(day => (
              <TableHead key={day} className="min-w-[140px] text-center">
                {getDayName(day)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map(slot => (
            <TableRow key={slot}>
              <TableCell className="font-medium text-sm whitespace-nowrap">
                {getTimeSlotLabel(slot)}
              </TableCell>
              {days.map(day => (
                <TableCell 
                  key={`${day}-${slot}`}
                  className={cn(
                    "p-0 h-24 align-top border",
                    timetable.days[day].slots[slot] ? "bg-white" : "bg-muted/30"
                  )}
                >
                  {renderPeriodCell(timetable.days[day].slots[slot], day, slot)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimetableGrid;
