
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
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
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Type definitions
interface Subject {
  id: string;
  name: string;
  periodsPerWeek?: number;
}

interface Course {
  id: string;
  name: string;
  medium?: string;
  subjects: Subject[];
}

// Sample medium options
const mediumOptions = ["English", "Hindi", "Telugu", "Kannada", "Tamil", "Marathi"];

// Sample initial data
const initialCourses: Course[] = [
  { 
    id: '1', 
    name: 'CBSE Class 1', 
    medium: 'English',
    subjects: [
      { id: '101', name: 'English', periodsPerWeek: 6 },
      { id: '102', name: 'Mathematics', periodsPerWeek: 6 },
      { id: '103', name: 'Environmental Science', periodsPerWeek: 4 }
    ] 
  },
  { 
    id: '2', 
    name: 'CBSE Class 2', 
    medium: 'English',
    subjects: [
      { id: '201', name: 'English', periodsPerWeek: 6 },
      { id: '202', name: 'Hindi', periodsPerWeek: 4 },
      { id: '203', name: 'Mathematics', periodsPerWeek: 6 },
      { id: '204', name: 'Environmental Science', periodsPerWeek: 4 }
    ] 
  },
  { 
    id: '3', 
    name: 'ICSE Class 1', 
    medium: 'English',
    subjects: [
      { id: '301', name: 'English', periodsPerWeek: 7 },
      { id: '302', name: 'Mathematics', periodsPerWeek: 7 },
      { id: '303', name: 'General Science', periodsPerWeek: 5 }
    ] 
  }
];

const CourseSubjectManagerPage: React.FC = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    medium: string;
    subjects: Subject[];
    newSubject: {
      name: string;
      periodsPerWeek: string;
    }
  }>({
    name: '',
    medium: '',
    subjects: [],
    newSubject: {
      name: '',
      periodsPerWeek: ''
    }
  });
  
  // Add Course / Edit Course dialog
  const handleAddEdit = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        medium: course.medium || '',
        subjects: [...course.subjects],
        newSubject: { name: '', periodsPerWeek: '' }
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        medium: '',
        subjects: [],
        newSubject: { name: '', periodsPerWeek: '' }
      });
    }
    setIsDialogOpen(true);
  };

  // View Course details dialog
  const handleView = (course: Course) => {
    setViewingCourse(course);
    setViewDialogOpen(true);
  };

  // Delete Course
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      });
    }
  };

  // Add new subject to the form
  const handleAddSubject = () => {
    if (!formData.newSubject.name.trim()) {
      toast({
        title: "Cannot add subject",
        description: "Subject name is required.",
        variant: "destructive"
      });
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: formData.newSubject.name,
      periodsPerWeek: formData.newSubject.periodsPerWeek ? parseInt(formData.newSubject.periodsPerWeek) : undefined
    };

    setFormData({
      ...formData,
      subjects: [...formData.subjects, newSubject],
      newSubject: { name: '', periodsPerWeek: '' }
    });
  };

  // Remove subject from the form
  const handleRemoveSubject = (id: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(subject => subject.id !== id)
    });
  };

  // Edit existing subject in the form
  const handleEditSubject = (id: string, field: 'name' | 'periodsPerWeek', value: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.map(subject => 
        subject.id === id 
          ? { 
              ...subject, 
              [field]: field === 'periodsPerWeek' ? (value ? parseInt(value) : undefined) : value 
            } 
          : subject
      )
    });
  };

  // Save course data
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Cannot save course",
        description: "Course name is required.",
        variant: "destructive"
      });
      return;
    }

    if (editingCourse) {
      // Update existing course
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === editingCourse.id 
            ? { 
                ...c, 
                name: formData.name, 
                medium: formData.medium || undefined,
                subjects: formData.subjects 
              } 
            : c
        )
      );
      toast({
        title: "Course updated",
        description: "The course has been updated successfully."
      });
    } else {
      // Add new course
      const newCourse: Course = {
        id: Date.now().toString(),
        name: formData.name,
        medium: formData.medium || undefined,
        subjects: formData.subjects
      };
      setCourses([...courses, newCourse]);
      toast({
        title: "Course added",
        description: "The new course has been added successfully."
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <AppLayout title="Course & Subject Manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Course & Subject Manager</h1>
          <Button onClick={() => handleAddEdit()} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Course</span>
          </Button>
        </div>

        {/* Desktop view: Table */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Course Name</TableHead>
                    <TableHead>Number of Subjects</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{course.subjects.length}</TableCell>
                      <TableCell>{course.medium || 'Not specified'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(course)}
                          >
                            <Eye size={16} />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddEdit(course)}
                          >
                            <Edit size={16} />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(course.id)}
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
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{course.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(course)}
                    >
                      <Eye size={16} />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddEdit(course)}
                    >
                      <Edit size={16} />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Medium</p>
                  <p>{course.medium || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Subjects</p>
                  <p>{course.subjects.length} subject(s)</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Course Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Course Details</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="Enter course name (e.g. CBSE Class 6)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium">Medium (Optional)</Label>
                  <Select
                    value={formData.medium}
                    onValueChange={(value) => setFormData({ ...formData, medium: value })}
                  >
                    <SelectTrigger id="medium">
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      {mediumOptions.map((medium) => (
                        <SelectItem key={medium} value={medium}>
                          {medium}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="subjects" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-7">
                      <Label htmlFor="subjectName">Subject Name</Label>
                      <Input
                        id="subjectName"
                        placeholder="E.g. Mathematics"
                        value={formData.newSubject.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          newSubject: { ...formData.newSubject, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor="periods">Periods/Week</Label>
                      <Input
                        id="periods"
                        type="number"
                        min="1"
                        placeholder="Optional"
                        value={formData.newSubject.periodsPerWeek}
                        onChange={(e) => setFormData({
                          ...formData,
                          newSubject: { ...formData.newSubject, periodsPerWeek: e.target.value }
                        })}
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button 
                        className="w-full" 
                        onClick={handleAddSubject}
                        disabled={!formData.newSubject.name.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {formData.subjects.length > 0 ? (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Periods/Week</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.subjects.map((subject) => (
                            <TableRow key={subject.id}>
                              <TableCell>
                                <Input
                                  value={subject.name}
                                  onChange={(e) => handleEditSubject(subject.id, 'name', e.target.value)}
                                  className="h-8 min-h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  value={subject.periodsPerWeek || ''}
                                  onChange={(e) => handleEditSubject(subject.id, 'periodsPerWeek', e.target.value)}
                                  className="h-8 min-h-8"
                                  placeholder="Optional"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveSubject(subject.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md text-muted-foreground">
                      No subjects added yet. Add your first subject above.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name.trim()}
            >
              {editingCourse ? 'Update' : 'Save'} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Course Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Course Details
            </DialogTitle>
          </DialogHeader>
          {viewingCourse && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Course Name</h3>
                  <p>{viewingCourse.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medium</h3>
                  <p>{viewingCourse.medium || 'Not specified'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Subjects ({viewingCourse.subjects.length})</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Periods/Week</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingCourse.subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell>{subject.periodsPerWeek || 'Not specified'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default CourseSubjectManagerPage;
