
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema, StaffFormValues, teacherSubjectSchema } from '@/schemas/teacher.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

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

interface EditStaffFormProps {
  staff: Staff;
  onSubmit: (data: StaffFormValues) => void;
  onCancel: () => void;
}

const departments = ['Science', 'Mathematics', 'Languages', 'Social Studies', 'Arts', 'Physical Education', 'Administration', 'Finance', 'Security', 'Housekeeping'];
const roles = ['Principal', 'Vice Principal', 'Head of Department', 'Senior Teacher', 'Teacher', 'Teaching Assistant'];
const weekDays = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
  'Social Studies', 'History', 'Geography', 'Computer Science', 'Physical Education',
  'Arts', 'Music', 'Environmental Science'
];

const classes = [
  'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
];

const sections = ['A', 'B', 'C', 'D', 'E'];

const EditStaffForm: React.FC<EditStaffFormProps> = ({ staff, onSubmit, onCancel }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const isTeacher = staff.staffType === 'teacher';
  
  // Transform staff data to match form schema
  const defaultValues: any = {
    name: staff.name,
    employeeId: staff.staffId,
    staffType: staff.staffType,
    department: staff.department,
    qualification: staff.qualification,
    salary: staff.salary,
    contactNumber: staff.phone,
    email: staff.email,
    joinDate: staff.joiningDate || new Date(),
    gender: (staff.gender?.toLowerCase() as "male" | "female" | "other") || "male",
    address: staff.address || "",
    dob: staff.dob,
  };
  
  // Add role if teacher
  if (isTeacher) {
    defaultValues.role = staff.role || '';
    defaultValues.subjects = staff.subjects || [];
    
    // Setup availability with default values if not present
    defaultValues.availability = {};
    weekDays.forEach(day => {
      if (staff.availability && staff.availability[day.id]) {
        defaultValues.availability[day.id] = staff.availability[day.id];
      } else {
        defaultValues.availability[day.id] = {
          available: day.id !== 'saturday' && day.id !== 'sunday',
          from: '09:00',
          to: '15:00'
        };
      }
    });
  } else {
    defaultValues.jobTitle = staff.jobTitle || '';
    defaultValues.responsibilities = staff.responsibilities || "Responsibilities not specified";
    defaultValues.workSchedule = staff.workSchedule || "Regular working hours";
  }
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues,
  });
  
  const staffType = form.watch('staffType');
  
  // Use field array for subjects if teacher
  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = 
    useFieldArray({
      control: form.control,
      name: "subjects",
    });
  
  const handleSubmit = (data: StaffFormValues) => {
    onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center pb-6">
              <Avatar className="h-24 w-24 mb-4">
                {staff.photo ? (
                  <AvatarImage src={staff.photo} alt={staff.name} />
                ) : (
                  <AvatarFallback className="text-3xl bg-primary/10">{getInitials(staff.name)}</AvatarFallback>
                )}
              </Avatar>
              <Button type="button" variant="outline" className="text-sm">
                Change Photo
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter staff ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="text-left font-normal"
                          >
                            {field.value ? format(field.value, 'PPP') : 'Select a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter address" 
                      className="min-h-[80px] resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="staffType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="teacher">Teaching Staff</SelectItem>
                        <SelectItem value="administrative">Administrative Staff</SelectItem>
                        <SelectItem value="finance">Finance Staff</SelectItem>
                        <SelectItem value="housekeeping">Housekeeping Staff</SelectItem>
                        <SelectItem value="security">Security Staff</SelectItem>
                        <SelectItem value="other">Other Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {staffType === 'teacher' ? (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter qualification" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary (₹/month)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter monthly salary" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="text-left font-normal"
                          >
                            {field.value ? format(field.value, 'PPP') : 'Select a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Responsibilities for non-teaching staff */}
            {staffType !== 'teacher' && (
              <>
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsibilities</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter responsibilities" 
                          className="min-h-[80px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="workSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Schedule</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter work schedule" 
                          className="min-h-[80px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Teacher-specific fields */}
        {staffType === 'teacher' && (
          <>
            {/* Subjects Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Assigned Subjects</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSubject({ subject: "", class: "", section: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectFields.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No subjects assigned. Click "Add Subject" to assign subjects.
                  </div>
                ) : (
                  subjectFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid gap-4 md:grid-cols-4 items-end border p-4 rounded-md"
                    >
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.subject`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject} value={subject}>
                                    {subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`subjects.${index}.class`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classes.map((cls) => (
                                  <SelectItem key={cls} value={cls}>
                                    {cls}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`subjects.${index}.section`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sections.map((section) => (
                                  <SelectItem key={section} value={section}>
                                    {section}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeSubject(index)}
                        className="h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weekDays.map((day) => (
                  <div key={day.id} className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">{day.label}</span>
                      <FormField
                        control={form.control}
                        name={`availability.${day.id}.available`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel>Available</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch(`availability.${day.id}.available`) && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`availability.${day.id}.from`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`availability.${day.id}.to`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit">
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditStaffForm;
