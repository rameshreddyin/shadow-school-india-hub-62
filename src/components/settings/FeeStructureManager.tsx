
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Plus, 
  Calculator, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
}

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
}

interface FeeHead {
  id: string;
  name: string;
  amount: number;
}

interface FeePlan {
  id: string;
  courseId: string;
  courseName: string;
  academicYearId: string;
  academicYearName: string;
  termType: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annually';
  distributeEvenly: boolean;
  feeHeads: FeeHead[];
  totalFee: number;
}

const FeeStructureManager: React.FC = () => {
  const [feePlans, setFeePlans] = useState<FeePlan[]>([
    {
      id: '1',
      courseId: '1',
      courseName: 'CBSE Class 6',
      academicYearId: '1',
      academicYearName: '2023-2024',
      termType: 'Quarterly',
      distributeEvenly: true,
      feeHeads: [
        { id: '1', name: 'Tuition Fee', amount: 12000 },
        { id: '2', name: 'Development Fee', amount: 5000 },
        { id: '3', name: 'Library Fee', amount: 3000 },
      ],
      totalFee: 20000,
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'CBSE Class 7',
      academicYearId: '1',
      academicYearName: '2023-2024',
      termType: 'Quarterly',
      distributeEvenly: true,
      feeHeads: [
        { id: '1', name: 'Tuition Fee', amount: 14000 },
        { id: '2', name: 'Development Fee', amount: 6000 },
        { id: '3', name: 'Library Fee', amount: 3000 },
      ],
      totalFee: 23000,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FeePlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<FeePlan | null>(null);
  const [formData, setFormData] = useState<{
    courseId: string;
    academicYearId: string;
    termType: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Annually';
    distributeEvenly: boolean;
    feeHeads: FeeHead[];
  }>({
    courseId: '',
    academicYearId: '',
    termType: 'Quarterly',
    distributeEvenly: true,
    feeHeads: [{ id: '1', name: '', amount: 0 }],
  });

  // Sample data for dropdowns
  const courses: Course[] = [
    { id: '1', name: 'CBSE Class 6' },
    { id: '2', name: 'CBSE Class 7' },
    { id: '3', name: 'CBSE Class 8' },
    { id: '4', name: 'CBSE Class 9' },
    { id: '5', name: 'CBSE Class 10' },
  ];

  const academicYears: AcademicYear[] = [
    { id: '1', name: '2023-2024', isActive: true },
    { id: '2', name: '2024-2025', isActive: false },
  ];

  const handleOpenAddDialog = () => {
    setEditingPlan(null);
    // Set default values
    setFormData({
      courseId: '',
      academicYearId: academicYears.find(year => year.isActive)?.id || '',
      termType: 'Quarterly',
      distributeEvenly: true,
      feeHeads: [{ id: Date.now().toString(), name: '', amount: 0 }],
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (plan: FeePlan) => {
    setEditingPlan(plan);
    setFormData({
      courseId: plan.courseId,
      academicYearId: plan.academicYearId,
      termType: plan.termType,
      distributeEvenly: plan.distributeEvenly,
      feeHeads: [...plan.feeHeads],
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (plan: FeePlan) => {
    setDeletingPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingPlan(null);
  };

  const calculateTotal = () => {
    return formData.feeHeads.reduce((sum, head) => sum + (head.amount || 0), 0);
  };

  const handleAddFeeHead = () => {
    setFormData({
      ...formData,
      feeHeads: [
        ...formData.feeHeads,
        { id: Date.now().toString(), name: '', amount: 0 },
      ],
    });
  };

  const handleRemoveFeeHead = (id: string) => {
    if (formData.feeHeads.length <= 1) {
      toast.error("You must have at least one fee head");
      return;
    }
    
    setFormData({
      ...formData,
      feeHeads: formData.feeHeads.filter(head => head.id !== id),
    });
  };

  const handleFeeHeadChange = (id: string, field: 'name' | 'amount', value: string | number) => {
    setFormData({
      ...formData,
      feeHeads: formData.feeHeads.map(head => 
        head.id === id ? { ...head, [field]: value } : head
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!formData.academicYearId) {
      toast.error("Please select an academic year");
      return;
    }

    // Check for empty fee heads
    const hasEmptyFeeHead = formData.feeHeads.some(
      head => !head.name.trim()
    );
    
    if (hasEmptyFeeHead) {
      toast.error("All fee head names must be filled");
      return;
    }

    // Calculate total fee
    const totalFee = calculateTotal();

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    const selectedYear = academicYears.find(y => y.id === formData.academicYearId);

    // Check if a fee plan already exists for this course and academic year
    const existingPlanIndex = feePlans.findIndex(
      plan => 
        plan.courseId === formData.courseId && 
        plan.academicYearId === formData.academicYearId &&
        (!editingPlan || plan.id !== editingPlan.id)
    );

    if (existingPlanIndex >= 0) {
      toast.error(`A fee plan already exists for ${selectedCourse?.name} in academic year ${selectedYear?.name}`);
      return;
    }

    if (editingPlan) {
      // Update existing plan
      const updatedPlans = feePlans.map(plan =>
        plan.id === editingPlan.id
          ? {
              ...plan,
              courseId: formData.courseId,
              courseName: selectedCourse?.name || '',
              academicYearId: formData.academicYearId,
              academicYearName: selectedYear?.name || '',
              termType: formData.termType,
              distributeEvenly: formData.distributeEvenly,
              feeHeads: formData.feeHeads,
              totalFee,
            }
          : plan
      );
      setFeePlans(updatedPlans);
      toast.success("Fee plan updated successfully");
    } else {
      // Create new plan
      const newPlan: FeePlan = {
        id: Date.now().toString(),
        courseId: formData.courseId,
        courseName: selectedCourse?.name || '',
        academicYearId: formData.academicYearId,
        academicYearName: selectedYear?.name || '',
        termType: formData.termType,
        distributeEvenly: formData.distributeEvenly,
        feeHeads: formData.feeHeads,
        totalFee,
      };
      setFeePlans([...feePlans, newPlan]);
      toast.success("Fee plan created successfully");
    }

    handleCloseDialog();
  };

  const handleDelete = () => {
    if (deletingPlan) {
      const updatedPlans = feePlans.filter(plan => plan.id !== deletingPlan.id);
      setFeePlans(updatedPlans);
      toast.success("Fee plan deleted successfully");
      handleCloseDeleteDialog();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Fee Structure Manager</h2>
        <Button variant="default" onClick={handleOpenAddDialog}>
          <PlusCircle className="h-4 w-4 mr-1" /> Add Fee Plan
        </Button>
      </div>

      {feePlans.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center text-center">
              <Calculator className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No Fee Plans</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't created any fee plans yet.
              </p>
              <Button onClick={handleOpenAddDialog}>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Fee Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Term Type</TableHead>
                <TableHead>Total Fee (₹)</TableHead>
                <TableHead>Fee Heads</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feePlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.courseName}</TableCell>
                  <TableCell>{plan.academicYearName}</TableCell>
                  <TableCell>{plan.termType}</TableCell>
                  <TableCell>₹{plan.totalFee.toLocaleString()}</TableCell>
                  <TableCell>{plan.feeHeads.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(plan)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(plan)}
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

      {/* Add/Edit Fee Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Edit Fee Plan' : 'Add Fee Plan'}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? 'Modify the fee plan details below.'
                : 'Create a new fee plan by filling in the details below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Course</label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => 
                      setFormData({ ...formData, courseId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Academic Year</label>
                  <Select
                    value={formData.academicYearId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, academicYearId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name} {year.isActive && "(Active)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Term Type</label>
                  <Select
                    value={formData.termType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, termType: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="distributeEvenly"
                    checked={formData.distributeEvenly}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, distributeEvenly: !!checked })
                    }
                  />
                  <label
                    htmlFor="distributeEvenly"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Distribute total fee evenly across terms
                  </label>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Fee Heads</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeeHead}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Fee Head
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.feeHeads.map((head, index) => (
                    <div
                      key={head.id}
                      className="flex items-center gap-2"
                    >
                      <Input
                        placeholder="Fee Head Name"
                        value={head.name}
                        onChange={(e) => handleFeeHeadChange(head.id, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={head.amount || ''}
                          onChange={(e) => handleFeeHeadChange(head.id, 'amount', Number(e.target.value))}
                          className="pl-7"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeeHead(head.id)}
                        disabled={formData.feeHeads.length <= 1}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4 border-t pt-3">
                  <div className="text-right">
                    <span className="text-sm font-medium">Total Fee:</span>
                    <span className="ml-2 text-lg font-bold">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPlan ? 'Update' : 'Create'} Fee Plan
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
              Are you sure you want to delete the fee plan for "{deletingPlan?.courseName}" in academic year "{deletingPlan?.academicYearName}"? This action cannot be undone.
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

export default FeeStructureManager;
