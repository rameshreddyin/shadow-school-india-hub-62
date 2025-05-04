
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type definitions
interface ClassSection {
  id: string;
  name: string;
  sections: string[];
  course: string;
}

// Sample data
const initialClasses: ClassSection[] = [
  { id: '1', name: 'Class 1', sections: ['A', 'B', 'C'], course: 'CBSE Class 1' },
  { id: '2', name: 'Class 2', sections: ['A', 'B'], course: 'CBSE Class 2' },
  { id: '3', name: 'Class 3', sections: ['A', 'B', 'C', 'D'], course: 'CBSE Class 3' },
  { id: '4', name: 'Class 4', sections: ['A', 'B'], course: 'CBSE Class 4' },
];

// Available courses and sections for selection
const availableCourses = [
  'CBSE Class 1', 'CBSE Class 2', 'CBSE Class 3', 'CBSE Class 4', 
  'CBSE Class 5', 'CBSE Class 6', 'CBSE Class 7', 'CBSE Class 8',
  'CBSE Class 9', 'CBSE Class 10', 'CBSE Class 11', 'CBSE Class 12',
  'ICSE Class 1', 'ICSE Class 2', 'ICSE Class 3', 'ICSE Class 4'
];

const availableSections = ['A', 'B', 'C', 'D', 'E', 'F'];
const availableClasses = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

const ClassSectionManagerPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassSection[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sections: [] as string[],
    course: ''
  });

  const handleAddEdit = (classItem?: ClassSection) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        sections: classItem.sections,
        course: classItem.course
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: availableClasses[0],
        sections: [],
        course: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (editingClass) {
      // Update existing class
      setClasses(classes.map(c =>
        c.id === editingClass.id
          ? { ...c, name: formData.name, sections: formData.sections, course: formData.course }
          : c
      ));
    } else {
      // Add new class
      const newClass: ClassSection = {
        id: Date.now().toString(),
        name: formData.name,
        sections: formData.sections,
        course: formData.course
      };
      setClasses([...classes, newClass]);
    }
    setIsDialogOpen(false);
  };

  const toggleSection = (section: string) => {
    setFormData(current => {
      if (current.sections.includes(section)) {
        return {
          ...current,
          sections: current.sections.filter(s => s !== section)
        };
      } else {
        return {
          ...current,
          sections: [...current.sections, section]
        };
      }
    });
  };

  return (
    <AppLayout title="Class & Section Manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Class & Section Manager</h1>
          <Button onClick={() => handleAddEdit()} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Class</span>
          </Button>
        </div>

        {/* Desktop view: Table */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Class Name</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Course Assigned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {classItem.sections.map(section => (
                            <span 
                              key={section} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                            >
                              {section}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{classItem.course}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEdit(classItem)}
                          >
                            <Edit size={16} />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(classItem.id)}
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Mobile view: Cards */}
        <div className="md:hidden space-y-4">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{classItem.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Sections</p>
                    <div className="flex flex-wrap gap-1">
                      {classItem.sections.map(section => (
                        <span 
                          key={section} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddEdit(classItem)}
                    >
                      <Edit size={16} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(classItem.id)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p className="text-sm">{classItem.course}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Class Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Select
                value={formData.name}
                onValueChange={(value) => setFormData({ ...formData, name: value })}
              >
                <SelectTrigger id="className">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sections</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {formData.sections.length > 0 
                      ? formData.sections.join(', ') 
                      : 'Select sections'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {availableSections.map(section => (
                    <DropdownMenuCheckboxItem
                      key={section}
                      checked={formData.sections.includes(section)}
                      onCheckedChange={() => toggleSection(section)}
                    >
                      Section {section}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="text-xs text-muted-foreground">
                Select one or more sections
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name || formData.sections.length === 0 || !formData.course}
            >
              {editingClass ? 'Update' : 'Add'} Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ClassSectionManagerPage;
