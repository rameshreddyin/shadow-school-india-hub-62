
import React from 'react';
import { StaffFormValues } from '@/schemas/teacher.schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import EditStaffForm from './EditStaffForm';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Staff {
  id: string;
  name: string;
  staffId: string;
  staffType: string;
  department: string;
  role?: string;
  jobTitle?: string;
  phone: string;
  email: string;
  qualification: string;
  salary: number;
  photo: string;
  gender?: string;
  address?: string;
  dob?: Date;
  joiningDate?: Date;
  responsibilities?: string;
  workSchedule?: string;
  subjects?: { subject: string; class: string; section: string }[];
  availability?: {
    [key: string]: { available: boolean; from: string; to: string };
  };
}

interface EditStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

const EditStaffDialog: React.FC<EditStaffDialogProps> = ({ isOpen, onClose, staff }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = (data: StaffFormValues) => {
    // In a real app, this would update the staff in your backend
    console.log('Updated staff data:', data);
    
    toast({
      title: 'Staff Updated',
      description: `${data.name}'s information has been updated successfully.`,
    });
    
    onClose();
  };
  
  // Return null if no staff is selected
  if (!staff) return null;

  // Use Sheet for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full overflow-auto pb-12" side="bottom">
          <SheetHeader className="py-4 text-left">
            <SheetTitle>Edit Staff</SheetTitle>
          </SheetHeader>
          <EditStaffForm 
            staff={staff} 
            onSubmit={handleSubmit} 
            onCancel={onClose} 
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>
        <EditStaffForm 
          staff={staff} 
          onSubmit={handleSubmit} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;
