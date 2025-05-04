
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Period } from '@/types/timetable';
import { mockSubjects, mockTeachers, mockTimeSlots, findAvailableTeachers } from '@/lib/timetable-utils';

interface AddPeriodModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (periodData: Period) => void;
  editingPeriod: Period | null;
  editingCell: { day: string; slot: string } | null;
  classInfo: { class: string; section: string };
}

const DAYS = [
  { id: 'monday', name: 'Monday' },
  { id: 'tuesday', name: 'Tuesday' },
  { id: 'wednesday', name: 'Wednesday' },
  { id: 'thursday', name: 'Thursday' },
  { id: 'friday', name: 'Friday' },
  { id: 'saturday', name: 'Saturday' },
];

const AddPeriodModal: React.FC<AddPeriodModalProps> = ({
  open,
  onClose,
  onSave,
  editingPeriod,
  editingCell,
  classInfo
}) => {
  const [day, setDay] = useState<string>(editingCell?.day || '');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [teacher, setTeacher] = useState<string>('');
  const [availableTeachers, setAvailableTeachers] = useState(mockTeachers);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  
  // Initialize form when editing
  useEffect(() => {
    if (editingCell) {
      setDay(editingCell.day);
    }
    
    if (editingPeriod) {
      setTimeSlot(editingPeriod.timeSlot.id);
      setSubject(editingPeriod.subject.id);
      setTeacher(editingPeriod.teacher.id);
    } else {
      setTimeSlot('');
      setSubject('');
      setTeacher('');
    }
  }, [editingPeriod, editingCell]);
  
  // Update available teachers when subject changes
  useEffect(() => {
    if (subject && day && timeSlot) {
      const selectedTimeSlot = mockTimeSlots.find(slot => slot.id === timeSlot);
      const selectedSubject = mockSubjects.find(s => s.id === subject);
      
      if (selectedTimeSlot && selectedSubject) {
        const available = findAvailableTeachers(selectedSubject.id, day, selectedTimeSlot);
        setAvailableTeachers(available);
        
        // Reset teacher if current selection is no longer available
        if (!available.some(t => t.id === teacher)) {
          setTeacher('');
        }
      }
    }
  }, [subject, day, timeSlot, teacher]);
  
  const handleSave = () => {
    if (!day || !timeSlot || !subject || !teacher) {
      return; // Form validation would handle this
    }
    
    const selectedSubject = mockSubjects.find(s => s.id === subject);
    const selectedTeacher = mockTeachers.find(t => t.id === teacher);
    const selectedTimeSlot = mockTimeSlots.find(t => t.id === timeSlot);
    
    if (selectedSubject && selectedTeacher && selectedTimeSlot) {
      const periodData: Period = {
        subject: {
          id: selectedSubject.id,
          name: selectedSubject.name,
          code: selectedSubject.code
        },
        teacher: {
          id: selectedTeacher.id,
          name: selectedTeacher.name,
          code: selectedTeacher.code
        },
        timeSlot: {
          id: selectedTimeSlot.id,
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime
        }
      };
      
      onSave(periodData);
    }
  };
  
  const getTimeSlotFromId = (slotId: string) => {
    const slot = mockTimeSlots.find(slot => slot.id === slotId);
    return slot ? `${slot.startTime} - ${slot.endTime}` : slotId;
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPeriod ? 'Edit Period' : 'Add Period'}
            </DialogTitle>
            <DialogDescription>
              {editingPeriod 
                ? 'Modify class period details for the selected time slot'
                : 'Add a new class period to the timetable'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select 
                  value={day} 
                  onValueChange={setDay}
                  disabled={!!editingCell}
                >
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Select 
                  value={timeSlot} 
                  onValueChange={setTimeSlot}
                  disabled={!!editingCell?.slot}
                >
                  <SelectTrigger id="timeSlot">
                    <SelectValue placeholder="Select Time Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.startTime} - {slot.endTime}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher</Label>
              <Select 
                value={teacher} 
                onValueChange={setTeacher}
                disabled={!subject || availableTeachers.length === 0}
              >
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.length > 0 ? (
                    availableTeachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No teachers available for this subject
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {subject && availableTeachers.length === 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No teachers are available for this subject during this time slot.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-2 text-sm text-muted-foreground">
              {editingCell && (
                <div>
                  Editing period for{' '}
                  <span className="font-medium">
                    {DAYS.find(d => d.id === day)?.name || day},{' '}
                    {editingCell.slot ? getTimeSlotFromId(editingCell.slot) : ''}
                  </span>
                </div>
              )}
              {classInfo && (
                <div>
                  Class: {classInfo.class}-{classInfo.section}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!day || !timeSlot || !subject || !teacher}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showConflictAlert} onOpenChange={setShowConflictAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Teacher Schedule Conflict</AlertDialogTitle>
            <AlertDialogDescription>
              This teacher is already assigned to another class during this time slot.
              Would you like to continue anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddPeriodModal;
