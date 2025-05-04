
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
import { Input } from '@/components/ui/input';
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

// Type definitions for our data
interface ClassSection {
  id: string;
  name: string;
  sections: string[];
  subjects?: string[];
}

// Sample initial data
const initialClasses: ClassSection[] = [
  { id: '1', name: '1', sections: ['A', 'B', 'C'], subjects: ['English', 'Mathematics', 'Science'] },
  { id: '2', name: '2', sections: ['A', 'B'], subjects: ['English', 'Mathematics', 'Science', 'Social Studies'] },
  { id: '3', name: '3', sections: ['A', 'B', 'C', 'D'], subjects: ['English', 'Mathematics', 'Science', 'Social Studies'] },
  { id: '4', name: '4', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies'] },
];

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassSection[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSection | null>(null);
  const [formData, setFormData] = useState({ name: '', sections: '' });

  const handleAddEdit = (classItem?: ClassSection) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({ 
        name: classItem.name,
        sections: classItem.sections.join(', ')
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', sections: '' });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    const sectionsArray = formData.sections
      .split(',')
      .map(section => section.trim())
      .filter(section => section !== '');
      
    if (editingClass) {
      // Update existing class
      setClasses(classes.map(c => 
        c.id === editingClass.id 
          ? { ...c, name: formData.name, sections: sectionsArray }
          : c
      ));
    } else {
      // Add new class
      const newClass: ClassSection = {
        id: Date.now().toString(),
        name: formData.name,
        sections: sectionsArray,
        subjects: []
      };
      setClasses([...classes, newClass]);
    }
    setIsDialogOpen(false);
  };

  return (
    <AppLayout title="Class & Section Setup">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Class & Section Setup</h1>
          <Button onClick={() => handleAddEdit()} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add New Class</span>
          </Button>
        </div>

        {/* Desktop view: Table */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Class Name</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead className="hidden sm:table-cell">Subjects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.sections.join(', ')}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {classItem.subjects ? classItem.subjects.join(', ') : 'None'}
                      </TableCell>
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
                <CardTitle className="text-lg">Class {classItem.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Sections</p>
                    <p>{classItem.sections.join(', ')}</p>
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
                  <p className="text-sm font-medium text-gray-500">Subjects</p>
                  <p className="text-sm">
                    {classItem.subjects && classItem.subjects.length > 0
                      ? classItem.subjects.join(', ')
                      : 'None'}
                  </p>
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
              <Input
                id="className"
                placeholder="Enter class name (e.g. 1, 2, 3)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sections">Sections (comma separated)</Label>
              <Input
                id="sections"
                placeholder="E.g. A, B, C"
                value={formData.sections}
                onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enter sections separated by commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={!formData.name || !formData.sections}>
              {editingClass ? 'Update' : 'Add'} Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ClassesPage;
