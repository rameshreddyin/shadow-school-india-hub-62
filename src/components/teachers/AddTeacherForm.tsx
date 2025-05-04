
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  staffId: z.string().optional(),
  gender: z.enum(['male', 'female', 'other'], { 
    required_error: "Please select a gender." 
  }),
  dob: z.date({
    required_error: "Date of birth is required.",
  }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().optional(),
  department: z.string().min(1, { message: "Department is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  qualification: z.string().optional(),
  joiningDate: z.date().optional(),
  photo: z.any().optional(),
  subjectAssignments: z.array(z.object({
    subject: z.string().min(1, { message: "Subject is required." }),
    class: z.string().min(1, { message: "Class is required." }),
    section: z.string().min(1, { message: "Section is required." }),
  })).optional(),
  availability: z.object({
    monday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
    tuesday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
    wednesday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
    thursday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
    friday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
    saturday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
    sunday: z.object({
      available: z.boolean().default(false),
      from: z.string().optional(),
      to: z.string().optional(),
    }),
  }).optional(),
});

interface AddTeacherFormProps {
  onSuccess: () => void;
  onAddAnother: () => void;
}

const weekDays = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const AddTeacherForm: React.FC<AddTeacherFormProps> = ({ onSuccess, onAddAnother }) => {
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("basic-info");
  const [applyToAll, setApplyToAll] = React.useState(false);
  const [standardTimeFrom, setStandardTimeFrom] = React.useState("");
  const [standardTimeTo, setStandardTimeTo] = React.useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      staffId: "",
      gender: undefined,
      department: "",
      role: "",
      phone: "",
      email: "",
      qualification: "",
      address: "",
      subjectAssignments: [{ subject: "", class: "", section: "" }],
      availability: {
        monday: { available: false, from: "", to: "" },
        tuesday: { available: false, from: "", to: "" },
        wednesday: { available: false, from: "", to: "" },
        thursday: { available: false, from: "", to: "" },
        friday: { available: false, from: "", to: "" },
        saturday: { available: false, from: "", to: "" },
        sunday: { available: false, from: "", to: "" },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjectAssignments"
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should not exceed 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        form.setValue('photo', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyToAll = () => {
    if (applyToAll && standardTimeFrom && standardTimeTo) {
      weekDays.forEach(day => {
        if (form.getValues(`availability.${day.id}.available`)) {
          form.setValue(`availability.${day.id}.from`, standardTimeFrom);
          form.setValue(`availability.${day.id}.to`, standardTimeTo);
        }
      });
    }
  };

  React.useEffect(() => {
    if (applyToAll && standardTimeFrom && standardTimeTo) {
      handleApplyToAll();
    }
  }, [standardTimeFrom, standardTimeTo, applyToAll]);

  const onSubmit = async (values: z.infer<typeof formSchema>, addAnother = false) => {
    try {
      // This is a mock submission - would be replaced with actual API call
      console.log('Submitting teacher data:', values);
      
      // Show success message
      toast.success(`Teacher ${values.name} added successfully!`);
      
      // Reset form or close dialog
      if (addAnother) {
        form.reset();
        setPhotoPreview(null);
        setActiveTab("basic-info");
        onAddAnother();
      } else {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to add teacher. Please try again.');
      console.error('Error adding teacher:', error);
    }
  };

  const goToNextTab = () => {
    if (activeTab === "basic-info") {
      setActiveTab("role-department");
    } else if (activeTab === "role-department") {
      setActiveTab("subject-classes");
    } else if (activeTab === "subject-classes") {
      setActiveTab("availability");
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "role-department") {
      setActiveTab("basic-info");
    } else if (activeTab === "subject-classes") {
      setActiveTab("role-department");
    } else if (activeTab === "availability") {
      setActiveTab("subject-classes");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="role-department">Role & Dept.</TabsTrigger>
            <TabsTrigger value="subject-classes">Subjects & Classes</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic-info" className="mt-4 space-y-4">
            <div className="flex flex-col items-center sm:items-start mb-6">
              <div className="mb-4">
                <Avatar className="h-24 w-24">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Teacher photo" />
                  ) : (
                    <AvatarFallback className="text-lg">Photo</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">Optional. Max size 2MB.</p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter staff ID (optional)" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave blank for auto-generation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-1 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1940-01-01")
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
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
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter address (optional)" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={goToNextTab}>
                Next Step
              </Button>
            </div>
          </TabsContent>
          
          {/* Role & Department Tab */}
          <TabsContent value="role-department" className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="vicePrincipal">Vice Principal</SelectItem>
                        <SelectItem value="headOfDepartment">Head of Department</SelectItem>
                        <SelectItem value="seniorTeacher">Senior Teacher</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="assistant">Teaching Assistant</SelectItem>
                        <SelectItem value="staff">Administrative Staff</SelectItem>
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
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="languages">Languages</SelectItem>
                        <SelectItem value="socialStudies">Social Studies</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                        <SelectItem value="physical">Physical Education</SelectItem>
                        <SelectItem value="administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                name="joiningDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goToPreviousTab}>
                Previous Step
              </Button>
              <Button type="button" onClick={goToNextTab}>
                Next Step
              </Button>
            </div>
          </TabsContent>
          
          {/* Subject & Classes Tab */}
          <TabsContent value="subject-classes" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Subjects & Classes</CardTitle>
                <CardDescription>
                  Add the subjects and classes that this teacher will be teaching
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-4 mb-4 sm:grid-cols-3 items-end">
                    <FormField
                      control={form.control}
                      name={`subjectAssignments.${index}.subject`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                              <SelectItem value="chemistry">Chemistry</SelectItem>
                              <SelectItem value="biology">Biology</SelectItem>
                              <SelectItem value="computerScience">Computer Science</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="geography">Geography</SelectItem>
                              <SelectItem value="artAndCraft">Art & Craft</SelectItem>
                              <SelectItem value="physicalEducation">Physical Education</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`subjectAssignments.${index}.class`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="class1">Class 1</SelectItem>
                              <SelectItem value="class2">Class 2</SelectItem>
                              <SelectItem value="class3">Class 3</SelectItem>
                              <SelectItem value="class4">Class 4</SelectItem>
                              <SelectItem value="class5">Class 5</SelectItem>
                              <SelectItem value="class6">Class 6</SelectItem>
                              <SelectItem value="class7">Class 7</SelectItem>
                              <SelectItem value="class8">Class 8</SelectItem>
                              <SelectItem value="class9">Class 9</SelectItem>
                              <SelectItem value="class10">Class 10</SelectItem>
                              <SelectItem value="class11">Class 11</SelectItem>
                              <SelectItem value="class12">Class 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`subjectAssignments.${index}.section`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select section" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="D">D</SelectItem>
                                  <SelectItem value="E">E</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="self-end"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ subject: "", class: "", section: "" })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Subject
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goToPreviousTab}>
                Previous Step
              </Button>
              <Button type="button" onClick={goToNextTab}>
                Next Step
              </Button>
            </div>
          </TabsContent>
          
          {/* Availability Tab */}
          <TabsContent value="availability" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Availability Schedule</CardTitle>
                <CardDescription>
                  Set the days and times when the teacher is available for classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="applyToAll" 
                      checked={applyToAll} 
                      onCheckedChange={(checked) => setApplyToAll(checked === true)}
                    />
                    <label
                      htmlFor="applyToAll"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Apply same time to all selected days
                    </label>
                  </div>
                  
                  {applyToAll && (
                    <div className="grid grid-cols-2 gap-2 sm:w-[300px]">
                      <div>
                        <label className="text-sm text-muted-foreground">From</label>
                        <Input 
                          type="time" 
                          value={standardTimeFrom} 
                          onChange={(e) => setStandardTimeFrom(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">To</label>
                        <Input 
                          type="time" 
                          value={standardTimeTo} 
                          onChange={(e) => setStandardTimeTo(e.target.value)} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-2 text-left font-medium text-sm">Day</th>
                        <th className="p-2 text-left font-medium text-sm">Available</th>
                        <th className="p-2 text-left font-medium text-sm">From</th>
                        <th className="p-2 text-left font-medium text-sm">To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekDays.map((day) => (
                        <tr key={day.id} className="border-t">
                          <td className="p-2">
                            <span className="font-medium">{day.label}</span>
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`availability.${day.id}.available`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`availability.${day.id}.from`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      {...field}
                                      disabled={!form.getValues(`availability.${day.id}.available`)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`availability.${day.id}.to`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="time"
                                      {...field}
                                      disabled={!form.getValues(`availability.${day.id}.available`)}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goToPreviousTab}>
                Previous Step
              </Button>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onSubmit(form.getValues(), true)}
                >
                  Save & Add Another
                </Button>
                <Button type="submit">Save Teacher</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default AddTeacherForm;
