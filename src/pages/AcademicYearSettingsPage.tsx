
import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, Check, Plus, AlertCircle, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

// Type definitions
interface AcademicYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Sample initial data
const initialYears: AcademicYear[] = [
  {
    id: '1',
    name: '2023-2024',
    startDate: new Date('2023-04-01'),
    endDate: new Date('2024-03-31'),
    isActive: true
  },
  {
    id: '2',
    name: '2022-2023',
    startDate: new Date('2022-04-01'),
    endDate: new Date('2023-03-31'),
    isActive: false
  },
];

const AcademicYearSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(initialYears);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    isActive: boolean;
  }>({
    name: '',
    startDate: undefined,
    endDate: undefined,
    isActive: false
  });

  // Check if any year is active
  const hasActiveYear = academicYears.some(year => year.isActive);

  const handleAddEdit = (year?: AcademicYear) => {
    if (year) {
      setEditingYear(year);
      setFormData({
        name: year.name,
        startDate: year.startDate,
        endDate: year.endDate,
        isActive: year.isActive
      });
    } else {
      setEditingYear(null);
      setFormData({
        name: '',
        startDate: undefined,
        endDate: undefined,
        isActive: !hasActiveYear // Set true by default if no active year
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const yearToDelete = academicYears.find(year => year.id === id);
    
    if (yearToDelete?.isActive) {
      toast({
        title: "Cannot Delete Active Year",
        description: "Please set another year as active before deleting this one.",
        variant: "destructive",
      });
      return;
    }
    
    if (confirm('Are you sure you want to delete this academic year?')) {
      setAcademicYears(academicYears.filter(year => year.id !== id));
      toast({
        title: "Academic Year Deleted",
        description: "The academic year has been deleted successfully."
      });
    }
  };

  const handleSetActive = (id: string) => {
    if (confirm('Are you sure you want to set this as the active academic year?')) {
      setAcademicYears(prevYears =>
        prevYears.map(year => ({
          ...year,
          isActive: year.id === id
        }))
      );
      
      toast({
        title: "Active Year Updated",
        description: "The academic year has been set as active."
      });
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an academic year name.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.startDate) {
      toast({
        title: "Validation Error",
        description: "Please select a start date.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Please select an end date.",
        variant: "destructive"
      });
      return;
    }

    if (formData.endDate <= formData.startDate) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    // If setting this year as active, deactivate others
    let updatedYears = [...academicYears];
    if (formData.isActive) {
      updatedYears = updatedYears.map(year => ({
        ...year,
        isActive: false
      }));
    }

    if (editingYear) {
      // Update existing year
      updatedYears = updatedYears.map(year =>
        year.id === editingYear.id
          ? { 
              ...year, 
              name: formData.name, 
              startDate: formData.startDate!, 
              endDate: formData.endDate!,
              isActive: formData.isActive
            } 
          : year
      );
      toast({
        title: "Academic Year Updated",
        description: "The academic year has been updated successfully."
      });
    } else {
      // Add new year
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        name: formData.name,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        isActive: formData.isActive
      };
      updatedYears.push(newYear);
      toast({
        title: "Academic Year Added",
        description: "The new academic year has been added successfully."
      });
    }

    setAcademicYears(updatedYears);
    setIsDialogOpen(false);
  };

  return (
    <AppLayout title="Academic Year Settings">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold">Academic Year Settings</h1>
          <Button onClick={() => handleAddEdit()} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Academic Year</span>
          </Button>
        </div>

        {/* Warning if no active year */}
        {!hasActiveYear && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              No active academic year set. Please set an active year as all operations (student admission, fee, attendance) depend on the active year.
            </AlertDescription>
          </Alert>
        )}

        {/* Desktop view: Table */}
        {!isMobile && (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Academic Year</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicYears.length > 0 ? (
                      academicYears.map((year) => (
                        <TableRow key={year.id}>
                          <TableCell className="font-medium">{year.name}</TableCell>
                          <TableCell>{format(year.startDate, "PPP")}</TableCell>
                          <TableCell>{format(year.endDate, "PPP")}</TableCell>
                          <TableCell>
                            {year.isActive ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {!year.isActive && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetActive(year.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Check size={14} />
                                  <span>Set Active</span>
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddEdit(year)}
                              >
                                <Edit size={14} />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(year.id)}
                                disabled={year.isActive}
                              >
                                <Trash2 size={14} />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                          No academic years found. Click "Add Academic Year" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Mobile view: Cards */}
        {isMobile && (
          <div className="space-y-4">
            {academicYears.length > 0 ? (
              academicYears.map((year) => (
                <Card key={year.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{year.name}</h3>
                        {year.isActive && (
                          <Badge className="bg-green-100 text-green-800 mt-1">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!year.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(year.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check size={14} />
                            <span className="sr-only">Set Active</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddEdit(year)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={14} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(year.id)}
                          disabled={year.isActive}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 size={14} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p>{format(year.startDate, "PPP")}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p>{format(year.endDate, "PPP")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-lg">
                No academic years found. Click "Add Academic Year" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Academic Year Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingYear ? 'Edit Academic Year' : 'Add New Academic Year'}
            </DialogTitle>
            <DialogDescription>
              {editingYear 
                ? 'Update the academic year details below' 
                : 'Set up a new academic year with the following details'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Academic Year Name</Label>
              <Input
                id="name"
                placeholder="e.g. 2024-2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
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
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
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
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({ ...formData, endDate: date })}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      disabled={(date) => 
                        formData.startDate ? date < formData.startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="setActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isActive: checked === true })
                }
              />
              <Label htmlFor="setActive" className="text-base cursor-pointer">
                Set as Active Year
              </Label>
            </div>
            
            {!hasActiveYear && !formData.isActive && (
              <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No active year is currently set. It is recommended to set this as the active year.
                </AlertDescription>
              </Alert>
            )}
            
            {hasActiveYear && formData.isActive && !editingYear?.isActive && (
              <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Setting this as active will deactivate the current active year.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>
              {editingYear ? 'Update' : 'Create'} Academic Year
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AcademicYearSettingsPage;
