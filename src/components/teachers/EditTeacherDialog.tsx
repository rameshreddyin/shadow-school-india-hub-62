
import React from 'react';
import { TeacherFormValues } from '@/schemas/teacher.schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import EditTeacherForm from './EditTeacherForm';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Teacher {
  id: string;
  name: string;
  staffId: string;
  department: string;
  role: string;
  phone: string;
  email: string;
  qualification: string;
  photo: string;
  gender?: string;
  address?: string;
  dob?: Date;
  joiningDate?: Date;
  subjects?: Array<{
    subject: string;
    class: string;
    section: string;
  }>;
  availability?: {
    [key: string]: {
      available: boolean;
      from: string;
      to: string;
    };
  };
}

interface EditTeacherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

const EditTeacherDialog: React.FC<EditTeacherDialogProps> = ({ isOpen, onClose, teacher }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = (data: TeacherFormValues) => {
    // In a real app, this would update the teacher in your backend
    console.log('Updated teacher data:', data);
    
    toast({
      title: 'Teacher Updated',
      description: `${data.name}'s information has been updated successfully.`,
    });
    
    onClose();
  };
  
  // Return null if no teacher is selected
  if (!teacher) return null;

  // Use Sheet for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full overflow-auto pb-12" side="bottom">
          <SheetHeader className="py-4 text-left">
            <SheetTitle>Edit Teacher</SheetTitle>
          </SheetHeader>
          <EditTeacherForm 
            teacher={teacher} 
            onSubmit={handleSubmit} 
            onCancel={onClose} 
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>
        <EditTeacherForm 
          teacher={teacher} 
          onSubmit={handleSubmit} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherDialog;
