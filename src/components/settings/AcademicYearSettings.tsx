
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Calendar,
  CalendarIcon,
  PlusCircle,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader,
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const AcademicYearSettings: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([
    {
      id: '1',
      name: '2023-2024',
      startDate: new Date('2023-04-01'),
      endDate: new Date('2024-03-31'),
      isActive: true,
    },
    {
      id: '2',
      name: '2024-2025',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      isActive: false,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    isActive: false,
  });

  const hasActiveYear = academicYears.some((year) => year.isActive);

  useEffect(() => {
    if (editingYear) {
      setFormData({
        name: editingYear.name,
        startDate: new Date(editingYear.startDate),
        endDate: new Date(editingYear.endDate),
        isActive: editingYear.isActive,
      });
    } else {
      // Default for new year
      const nextYearStart = new Date();
      nextYearStart.setFullYear(nextYearStart.getFullYear());
      nextYearStart.setMonth(3); // April
      nextYearStart.setDate(1);

      const nextYearEnd = new Date(nextYearStart);
      nextYearEnd.setFullYear(nextYearEnd.getFullYear() + 1);
      nextYearEnd.setMonth(2); // March
      nextYearEnd.setDate(31);

      setFormData({
        name: `${nextYearStart.getFullYear()}-${nextYearEnd.getFullYear()}`,
        startDate: nextYearStart,
        endDate: nextYearEnd,
        isActive: !hasActiveYear,
      });
    }
  }, [editingYear, isDialogOpen, hasActiveYear]);

  const handleOpenAddDialog = () => {
    setEditingYear(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (year: AcademicYear) => {
    setEditingYear(year);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (year: AcademicYear) => {
    setDeletingYear(year);
    setIsDeleteDialogOpen(true);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingYear(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingYear(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (formData.startDate >= formData.endDate) {
      toast.error("End date must be after start date");
      return;
    }

    // If setting this year as active, deactivate all others
    let updatedYears = [...academicYears];
    if (formData.isActive) {
      updatedYears = updatedYears.map((year) => ({
        ...year,
        isActive: false,
      }));
    }

    if (editingYear) {
      // Update existing year
      updatedYears = updatedYears.map((year) =>
        year.id === editingYear.id
          ? {
              ...year,
              name: formData.name,
              startDate: formData.startDate,
              endDate: formData.endDate,
              isActive: formData.isActive,
            }
          : year
      );
      toast.success("Academic year updated successfully");
    } else {
      // Add new year
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      };
      updatedYears.push(newYear);
      toast.success("New academic year added successfully");
    }

    setAcademicYears(updatedYears);
    handleCloseDialog();
  };

  const handleDelete = () => {
    if (deletingYear) {
      // Don't allow deleting if it's the active year
      if (deletingYear.isActive) {
        toast.error("Cannot delete the active academic year");
        handleCloseDeleteDialog();
        return;
      }

      const updatedYears = academicYears.filter(
        (year) => year.id !== deletingYear.id
      );
      setAcademicYears(updatedYears);
      toast.success("Academic year deleted successfully");
      handleCloseDeleteDialog();
    }
  };

  const handleSetActive = (yearId: string) => {
    const updatedYears = academicYears.map((year) => ({
      ...year,
      isActive: year.id === yearId,
    }));
    setAcademicYears(updatedYears);
    toast.success("Active academic year updated");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Academic Year Settings</h2>
        <Button variant="default" onClick={handleOpenAddDialog}>
          <PlusCircle className="h-4 w-4 mr-1" /> Add Academic Year
        </Button>
      </div>

      {academicYears.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No Academic Years</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't added any academic years yet.
              </p>
              <Button onClick={handleOpenAddDialog}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Academic Year
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academic Year</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicYears.map((year) => (
                <TableRow key={year.id}>
                  <TableCell className="font-medium">{year.name}</TableCell>
                  <TableCell>{format(new Date(year.startDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date(year.endDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {year.isActive ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {!year.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetActive(year.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Set Active
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(year)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(year)}
                        disabled={year.isActive}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!hasActiveYear && (
        <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No active academic year is set. Please set an active year for proper functioning of the system.
          </AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Academic Year Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
            </DialogTitle>
            <DialogDescription>
              {editingYear 
                ? 'Modify the academic year details below.' 
                : 'Create a new academic year by filling the form below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="academicYear" className="text-sm font-medium">
                  Academic Year Name
                </label>
                <Input
                  id="academicYear"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., 2024-2025"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          format(formData.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <DatePicker
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && handleChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          format(formData.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <DatePicker
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => date && handleChange('endDate', date)}
                        fromDate={formData.startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', !!checked)}
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Set as Active Academic Year
                </label>
              </div>
              
              {!hasActiveYear && !formData.isActive && (
                <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No active year is currently set. It is recommended to set this as the active year.
                  </AlertDescription>
                </Alert>
              )}
              
              {hasActiveYear && formData.isActive && !editingYear?.isActive && (
                <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Setting this as active will deactivate the current active year.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingYear ? 'Update' : 'Add'} Academic Year
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the academic year "{deletingYear?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AcademicYearSettings;
