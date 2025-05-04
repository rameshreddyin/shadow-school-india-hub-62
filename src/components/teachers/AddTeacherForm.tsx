
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  staffId: z.string().min(2, { message: "Staff ID is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  qualification: z.string().optional(),
  joiningDate: z.string().optional(),
  photo: z.any().optional(),
});

interface AddTeacherFormProps {
  onSuccess: () => void;
  onAddAnother: () => void;
}

const AddTeacherForm: React.FC<AddTeacherFormProps> = ({ onSuccess, onAddAnother }) => {
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      staffId: "",
      department: "",
      role: "",
      phone: "",
      email: "",
      qualification: "",
      joiningDate: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        form.setValue('photo', file);
      };
      reader.readAsDataURL(file);
    }
  };

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
        onAddAnother();
      } else {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to add teacher. Please try again.');
      console.error('Error adding teacher:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Teacher Photo Upload */}
          <div className="sm:col-span-2 flex flex-col items-center">
            <div className="mb-2">
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

          {/* Teacher Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter teacher name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Staff ID */}
          <FormField
            control={form.control}
            name="staffId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter staff ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department */}
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

          {/* Role */}
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

          {/* Phone */}
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

          {/* Email */}
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

          {/* Qualification */}
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

          {/* Joining Date */}
          <FormField
            control={form.control}
            name="joiningDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joining Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
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
      </form>
    </Form>
  );
};

export default AddTeacherForm;
