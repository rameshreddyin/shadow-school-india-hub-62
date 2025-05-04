
import React, { useState } from 'react';
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
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CopyTimetableModalProps {
  open: boolean;
  onClose: () => void;
  onCopy: (sourceClass: string, sourceSection: string) => void;
  currentClass: string;
  currentSection: string;
  availableClasses: string[];
  availableSections: string[];
}

const CopyTimetableModal: React.FC<CopyTimetableModalProps> = ({
  open,
  onClose,
  onCopy,
  currentClass,
  currentSection,
  availableClasses,
  availableSections
}) => {
  const [sourceClass, setSourceClass] = useState<string>('');
  const [sourceSection, setSourceSection] = useState<string>('');
  
  const handleCopy = () => {
    if (sourceClass && sourceSection) {
      onCopy(sourceClass, sourceSection);
    }
  };
  
  // Filter out the current class-section combination
  const filteredClasses = availableClasses.filter(cls => 
    !(cls === currentClass && sourceSection === currentSection)
  );
  
  const filteredSections = sourceClass === currentClass 
    ? availableSections.filter(section => section !== currentSection)
    : availableSections;
  
  const isSameClass = currentClass === sourceClass && currentSection === sourceSection;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Copy Timetable</DialogTitle>
          <DialogDescription>
            Copy timetable from another class and section to {currentClass}-{currentSection}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Source Class</Label>
            <Select value={sourceClass} onValueChange={setSourceClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Source Section</Label>
            <Select 
              value={sourceSection} 
              onValueChange={setSourceSection}
              disabled={!sourceClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {filteredSections.map((section) => (
                  <SelectItem key={section} value={section}>
                    Section {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isSameClass && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You cannot copy a timetable to itself.
              </AlertDescription>
            </Alert>
          )}
          
          <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
            <AlertDescription>
              This will overwrite the current timetable for Class {currentClass}-{currentSection}.
            </AlertDescription>
          </Alert>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCopy} 
            disabled={!sourceClass || !sourceSection || isSameClass}
          >
            Copy Timetable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CopyTimetableModal;
