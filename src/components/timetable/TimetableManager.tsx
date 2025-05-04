
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TimetableGrid from './TimetableGrid';
import AddPeriodModal from './AddPeriodModal';
import CopyTimetableModal from './CopyTimetableModal';
import { generateEmptyTimetable } from '@/lib/timetable-utils';

// Types
import { ClassSection, Timetable, Period } from '@/types/timetable';

// Mock data
const mockClasses = ['6', '7', '8', '9', '10', '11', '12'];
const mockSections = ['A', 'B', 'C', 'D'];

const TimetableManager: React.FC = () => {
  const { toast } = useToast();
  
  // State for selected class and section
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  
  // State for timetable data
  const [timetables, setTimetables] = useState<Record<string, Timetable>>({});
  const [currentTimetable, setCurrentTimetable] = useState<Timetable | null>(null);
  
  // State for modals
  const [addPeriodModalOpen, setAddPeriodModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [editingCell, setEditingCell] = useState<{day: string, slot: string} | null>(null);
  
  // Update current timetable when class or section changes
  useEffect(() => {
    if (selectedClass && selectedSection) {
      const key = `${selectedClass}-${selectedSection}`;
      
      // If this timetable doesn't exist yet, create an empty one
      if (!timetables[key]) {
        const newTimetable = generateEmptyTimetable();
        setTimetables(prev => ({
          ...prev,
          [key]: newTimetable
        }));
        setCurrentTimetable(newTimetable);
      } else {
        setCurrentTimetable(timetables[key]);
      }
    } else {
      setCurrentTimetable(null);
    }
  }, [selectedClass, selectedSection, timetables]);
  
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSection('');
  };
  
  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
  };
  
  const handleAddPeriod = () => {
    setEditingPeriod(null);
    setEditingCell(null);
    setAddPeriodModalOpen(true);
  };
  
  const handleEditPeriod = (day: string, slot: string) => {
    if (currentTimetable) {
      const period = currentTimetable.days[day]?.slots[slot] || null;
      setEditingPeriod(period);
      setEditingCell({ day, slot });
      setAddPeriodModalOpen(true);
    }
  };
  
  const handleClearPeriod = (day: string, slot: string) => {
    if (currentTimetable) {
      const updatedTimetable = {
        ...currentTimetable,
        days: {
          ...currentTimetable.days,
          [day]: {
            ...currentTimetable.days[day],
            slots: {
              ...currentTimetable.days[day].slots,
              [slot]: null
            }
          }
        }
      };
      
      const key = `${selectedClass}-${selectedSection}`;
      setTimetables(prev => ({
        ...prev,
        [key]: updatedTimetable
      }));
      setCurrentTimetable(updatedTimetable);
      
      toast({
        title: "Period Cleared",
        description: `Period has been cleared from the timetable.`
      });
    }
  };
  
  const handleSavePeriod = (periodData: Period) => {
    if (!currentTimetable || !editingCell) return;
    
    const { day, slot } = editingCell;
    
    // Check for teacher conflicts
    const hasConflict = Object.entries(currentTimetable.days).some(([currentDay, dayData]) => {
      if (currentDay !== day) return false;
      
      return Object.entries(dayData.slots).some(([currentSlot, period]) => {
        if (currentSlot !== slot && 
            period && 
            period.teacher.id === periodData.teacher.id && 
            period.timeSlot.id === periodData.timeSlot.id) {
          return true;
        }
        return false;
      });
    });
    
    if (hasConflict) {
      toast({
        title: "Teacher Conflict",
        description: "This teacher is already assigned to another class during this time slot.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTimetable = {
      ...currentTimetable,
      days: {
        ...currentTimetable.days,
        [day]: {
          ...currentTimetable.days[day],
          slots: {
            ...currentTimetable.days[day].slots,
            [slot]: periodData
          }
        }
      }
    };
    
    const key = `${selectedClass}-${selectedSection}`;
    setTimetables(prev => ({
      ...prev,
      [key]: updatedTimetable
    }));
    setCurrentTimetable(updatedTimetable);
    setAddPeriodModalOpen(false);
    
    toast({
      title: "Period Saved",
      description: `${periodData.subject.name} has been added to the timetable.`
    });
  };
  
  const handleCopyTimetable = (sourceClass: string, sourceSection: string) => {
    const sourceKey = `${sourceClass}-${sourceSection}`;
    const targetKey = `${selectedClass}-${selectedSection}`;
    
    if (timetables[sourceKey]) {
      setTimetables(prev => ({
        ...prev,
        [targetKey]: JSON.parse(JSON.stringify(timetables[sourceKey]))
      }));
      setCurrentTimetable(timetables[sourceKey]);
      
      toast({
        title: "Timetable Copied",
        description: `Timetable copied from Class ${sourceClass}-${sourceSection} to Class ${selectedClass}-${selectedSection}.`
      });
    } else {
      toast({
        title: "Copy Failed",
        description: "Source timetable not found.",
        variant: "destructive"
      });
    }
    
    setCopyModalOpen(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
          <span>Class Timetable</span>
        </CardTitle>
        <CardDescription>
          Manage weekly class schedules and assign teachers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">Class</label>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">Section</label>
            <Select 
              value={selectedSection} 
              onValueChange={handleSectionChange}
              disabled={!selectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {mockSections.map((section) => (
                  <SelectItem key={section} value={section}>
                    Section {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:ml-auto md:self-end">
            <Button 
              variant="outline" 
              onClick={() => setCopyModalOpen(true)}
              disabled={!selectedClass || !selectedSection}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy from Class
            </Button>
            <Button 
              onClick={handleAddPeriod}
              disabled={!selectedClass || !selectedSection}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Period
            </Button>
          </div>
        </div>
        
        {!selectedClass || !selectedSection ? (
          <div className="bg-muted p-8 rounded-lg text-center">
            <p className="text-muted-foreground">
              Please select a class and section to view or edit the timetable
            </p>
          </div>
        ) : currentTimetable ? (
          <TimetableGrid 
            timetable={currentTimetable}
            onEditPeriod={handleEditPeriod}
            onClearPeriod={handleClearPeriod}
          />
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load timetable data. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      {addPeriodModalOpen && (
        <AddPeriodModal 
          open={addPeriodModalOpen}
          onClose={() => setAddPeriodModalOpen(false)}
          onSave={handleSavePeriod}
          editingPeriod={editingPeriod}
          editingCell={editingCell}
          classInfo={{ class: selectedClass, section: selectedSection }}
        />
      )}
      
      {copyModalOpen && (
        <CopyTimetableModal 
          open={copyModalOpen}
          onClose={() => setCopyModalOpen(false)}
          onCopy={handleCopyTimetable}
          currentClass={selectedClass}
          currentSection={selectedSection}
          availableClasses={mockClasses}
          availableSections={mockSections}
        />
      )}
    </Card>
  );
};

export default TimetableManager;
