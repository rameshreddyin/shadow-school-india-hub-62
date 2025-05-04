
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
import AddTeacherForm from './AddTeacherForm';

interface AddTeacherDialogProps {
  trigger?: React.ReactNode;
}

const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({ trigger }) => {
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
            <span>Add Teacher</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill in the teacher details and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <AddTeacherForm onSuccess={handleSuccess} onAddAnother={handleAddAnother} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherDialog;
