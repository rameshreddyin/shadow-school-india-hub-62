import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddStudentForm from './AddStudentForm';

interface AddStudentDialogProps {
  trigger?: React.ReactNode;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ trigger }) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleAddAnother = () => {
    // Keep the dialog open, form will reset itself
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Fill in the student details. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <AddStudentForm onSuccess={handleSuccess} onAddAnother={handleAddAnother} />
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
