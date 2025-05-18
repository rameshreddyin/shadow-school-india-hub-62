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
import { CalendarIcon, Plus, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { sanitizeFormData } from '@/utils/sanitize';
import { StaffType, staffTypeEnum, teacherSchema, nonTeachingStaffSchema } from '@/schemas/teacher.schema';

// Teacher form section (reused from existing component)
const TeacherFormSection = ({ form, activeTab, setActiveTab, goToPreviousTab, goToNextTab, isSubmitting, onSubmit, fields, append, remove }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState(false);
  const [standardTimeFrom, setStandardTimeFrom] = useState("");
  const [standardTimeTo, setStandardTimeTo] = useState("");

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
        // Using type-safe approach by accessing the specific day properties
        const dayId = day.id;
        if (form.getValues(`availability.${dayId}.available`)) {
          form.setValue(`availability.${dayId}.from` as const, standardTimeFrom);
          form.setValue(`availability.${dayId}.to` as const, standardTimeTo);
        }
      });
    }
  };

  React.useEffect(() => {
    if (applyToAll && standardTimeFrom && standardTimeTo) {
      handleApplyToAll();
    }
  }, [standardTimeFrom, standardTimeTo, applyToAll]);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="role-department">Role & Dept.</TabsTrigger>
          <TabsTrigger value="subject-classes">Subjects & Classes</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        {/* Basic Information Tab */}
        <TabsContent value="basic-info" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Teacher photo" />
                  ) : (
                    <AvatarFallback className="text-3xl bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground/60" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <label 
                  htmlFor="photo" 
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1 text-center">Max size 2MB</p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 flex-1">
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
                name="employeeId"
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
                          className="rounded-md border shadow-md"
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
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={goToNextTab} className="px-6">
              Next Step
            </Button>
          </div>
        </TabsContent>
        
        {/* Role & Department Tab */}
        <TabsContent value="role-department" className="mt-4 space-y-4">
          <Card className="border-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Professional Information</CardTitle>
              <CardDescription>
                Enter the teacher's role, department, and professional details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
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
                        <Input placeholder="E.g., Ph.D. in Physics, M.Ed." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="joinDate"
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
                            className="rounded-md border shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Salary</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter salary amount" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
        
        {/* Subject & Classes Tab */}
        <TabsContent value="subject-classes" className="mt-4 space-y-4">
          <Card className="border-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Assigned Subjects & Classes</CardTitle>
              <CardDescription>
                Add the subjects and classes that this teacher will be teaching
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div key={field.id} className="grid gap-4 mb-6 sm:grid-cols-3 items-end relative">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-muted hover:bg-destructive hover:text-white"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <FormField
                    control={form.control}
                    name={`subjects.${index}.subject`}
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
                    name={`subjects.${index}.class`}
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
                  
                  <FormField
                    control={form.control}
                    name={`subjects.${index}.section`}
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
          <Card className="border-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Availability Schedule</CardTitle>
              <CardDescription>
                Set the days and times when the teacher is available for classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted/20 rounded-lg flex flex-col sm:flex-row sm:items-center gap-4">
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
              
              <div className="border rounded-md overflow-hidden">
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
                      <tr key={day.id} className="border-t hover:bg-muted/20">
                        <td className="p-2">
                          <span className="font-medium">{day.label}</span>
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`availability.${day.id}.available` as const}
                            render={({ field }) => (
                              <FormItem className="m-0">
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
                            name={`availability.${day.id}.from` as const}
                            render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    disabled={!form.getValues(`availability.${day.id}.available` as const)}
                                    className="max-w-[150px]"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <FormField
                            control={form.control}
                            name={`availability.${day.id}.to` as const}
                            render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    disabled={!form.getValues(`availability.${day.id}.available` as const)}
                                    className="max-w-[150px]"
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
                disabled={isSubmitting}
              >
                Save & Add Another
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Staff'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

// Non-Teaching Staff form section
const NonTeachingStaffFormSection = ({ form, activeTab, setActiveTab, goToPreviousTab, onSubmit, isSubmitting }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
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

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="job-info">Job Information</TabsTrigger>
        </TabsList>
        
        {/* Basic Information Tab */}
        <TabsContent value="basic-info" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Staff photo" />
                  ) : (
                    <AvatarFallback className="text-3xl bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground/60" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div>
                <label 
                  htmlFor="staffPhoto" 
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-medium transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </label>
                <Input
                  id="staffPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1 text-center">Max size 2MB</p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 flex-1">
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
                name="employeeId"
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
                          className="rounded-md border shadow-md"
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
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={() => setActiveTab("job-info")} className="px-6">
              Next Step
            </Button>
          </div>
        </TabsContent>
        
        {/* Job Information Tab */}
        <TabsContent value="job-info" className="mt-4 space-y-4">
          <Card className="border-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Job Information</CardTitle>
              <CardDescription>
                Enter staff job details, responsibilities and other information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
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
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="finance">Finance & Accounts</SelectItem>
                          <SelectItem value="humanResources">Human Resources</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="housekeeping">Housekeeping</SelectItem>
                          <SelectItem value="itSupport">IT Support</SelectItem>
                          <SelectItem value="library">Library</SelectItem>
                          <SelectItem value="canteen">Canteen</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Admin Assistant, Accountant" {...field} />
                      </FormControl>
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
                        <Input placeholder="E.g., B.Com, Diploma in Admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date *</FormLabel>
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
                            className="rounded-md border shadow-md"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Salary *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter salary amount" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                        <Input placeholder="E.g., Mon-Fri, 9AM-5PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Responsibilities *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter staff responsibilities"
                          className="resize-none min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                disabled={isSubmitting}
              >
                Save & Add Another
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Staff'}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

type DayId = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const weekDays = [
  { id: 'monday' as DayId, label: 'Monday' },
  { id: 'tuesday' as DayId, label: 'Tuesday' },
  { id: 'wednesday' as DayId, label: 'Wednesday' },
  { id: 'thursday' as DayId, label: 'Thursday' },
  { id: 'friday' as DayId, label: 'Friday' },
  { id: 'saturday' as DayId, label: 'Saturday' },
  { id: 'sunday' as DayId, label: 'Sunday' },
];

interface AddStaffFormProps {
  onSuccess: () => void;
  onAddAnother: () => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSuccess, onAddAnother }) => {
  const [staffType, setStaffType] = useState<StaffType>("teacher");
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create appropriate schema and form based on staff type
  const schema = staffType === "teacher" 
    ? teacherSchema 
    : nonTeachingStaffSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: staffType === "teacher" ? {
      name: "",
      employeeId: "",
      gender: undefined,
      staffType: "teacher",
      department: "",
      role: "",
      contactNumber: "",
      email: "",
      qualification: "",
      address: "",
      salary: undefined,
      subjects: [{ subject: "", class: "", section: "" }],
      availability: {
        monday: { available: false, from: "", to: "" },
        tuesday: { available: false, from: "", to: "" },
        wednesday: { available: false, from: "", to: "" },
        thursday: { available: false, from: "", to: "" },
        friday: { available: false, from: "", to: "" },
        saturday: { available: false, from: "", to: "" },
        sunday: { available: false, from: "", to: "" },
      },
    } : {
      name: "",
      employeeId: "",
      gender: undefined,
      staffType: staffType,
      department: "",
      jobTitle: "",
      contactNumber: "",
      email: "",
      qualification: "",
      address: "",
      salary: undefined,
      responsibilities: "",
      workSchedule: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  // Reset form when staff type changes
  React.useEffect(() => {
    form.reset(staffType === "teacher" ? {
      name: "",
      employeeId: "",
      gender: undefined,
      staffType: "teacher",
      department: "",
      role: "",
      contactNumber: "",
      email: "",
      qualification: "",
      address: "",
      salary: undefined,
      subjects: [{ subject: "", class: "", section: "" }],
      availability: {
        monday: { available: false, from: "", to: "" },
        tuesday: { available: false, from: "", to: "" },
        wednesday: { available: false, from: "", to: "" },
        thursday: { available: false, from: "", to: "" },
        friday: { available: false, from: "", to: "" },
        saturday: { available: false, from: "", to: "" },
        sunday: { available: false, from: "", to: "" },
      },
    } : {
      name: "",
      employeeId: "",
      gender: undefined,
      staffType: staffType,
      department: "",
      jobTitle: "",
      contactNumber: "",
      email: "",
      qualification: "",
      address: "",
      salary: undefined,
      responsibilities: "",
      workSchedule: "",
    });
    setActiveTab("basic-info");
  }, [staffType, form]);

  const goToNextTab = () => {
    if (staffType === 'teacher') {
      if (activeTab === "basic-info") {
        setActiveTab("role-department");
      } else if (activeTab === "role-department") {
        setActiveTab("subject-classes");
      } else if (activeTab === "subject-classes") {
        setActiveTab("availability");
      }
    } else {
      if (activeTab === "basic-info") {
        setActiveTab("job-info");
      }
    }
  };

  const goToPreviousTab = () => {
    if (staffType === 'teacher') {
      if (activeTab === "role-department") {
        setActiveTab("basic-info");
      } else if (activeTab === "subject-classes") {
        setActiveTab("role-department");
      } else if (activeTab === "availability") {
        setActiveTab("subject-classes");
      }
    } else {
      if (activeTab === "job-info") {
        setActiveTab("basic-info");
      }
    }
  };

  const onSubmit = async (values, addAnother = false) => {
    try {
      setIsSubmitting(true);
      
      // Sanitize form data to prevent XSS attacks
      const sanitizedValues = sanitizeFormData(values);
      
      // This is a mock submission - would be replaced with actual API call
      console.log(`Submitting ${staffType} data:`, sanitizedValues);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show success message
      toast.success(`${staffType === 'teacher' ? 'Teacher' : 'Staff member'} ${sanitizedValues.name} added successfully!`);
      
      // Reset form or close dialog
      if (addAnother) {
        form.reset();
        setActiveTab("basic-info");
        onAddAnother();
      } else {
        onSuccess();
      }
    } catch (error) {
      toast.error(`Failed to add ${staffType === 'teacher' ? 'teacher' : 'staff member'}. Please try again.`);
      console.error(`Error adding ${staffType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <div className="mb-6">
        <FormField
          control={form.control}
          name="staffType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff Type</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setStaffType(value as StaffType);
                }} 
                defaultValue={field.value}
              >
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
              <FormDescription>
                Select the type of staff member you want to add
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-6">
        {staffType === "teacher" ? (
          <TeacherFormSection 
            form={form}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            goToPreviousTab={goToPreviousTab}
            goToNextTab={goToNextTab}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            fields={fields}
            append={append}
            remove={remove}
          />
        ) : (
          <NonTeachingStaffFormSection 
            form={form}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            goToPreviousTab={goToPreviousTab}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        )}
      </form>
    </Form>
  );
};

export default AddStaffForm;
