
import React, { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

const schoolInfoSchema = z.object({
  schoolName: z.string().min(3, { message: "School name must be at least 3 characters" }),
  address: z.string().min(10, { message: "Address must be at least 10 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  board: z.string().min(1, { message: "Please select a board" }),
  academicYear: z.string().min(1, { message: "Please select an academic year" }),
});

type SchoolInfoValues = z.infer<typeof schoolInfoSchema>;

const SchoolInfoSettings: React.FC = () => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Mock data for saved values
  const defaultValues: SchoolInfoValues = {
    schoolName: "Delhi Public School",
    address: "123 Education Street, New Delhi, 110001, India",
    email: "info@delhipublicschool.edu.in",
    phone: "+91 11 2345 6789",
    board: "cbse",
    academicYear: "2024-2025",
  };
  
  const form = useForm<SchoolInfoValues>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues,
  });
  
  const onSubmit = (data: SchoolInfoValues) => {
    // In a real app, we would save the data to the server
    console.log("Saving school info:", data);
    
    toast({
      title: "Settings Saved",
      description: "Your school information has been updated successfully.",
    });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo image should be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
              {logoPreview ? (
                <img src={logoPreview} alt="School Logo" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl font-bold">DPS</span>
                  <span className="text-xs mt-1">Logo Preview</span>
                </div>
              )}
            </div>
            <label htmlFor="logo-upload" className="absolute -bottom-3 -right-3 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 border">
              <Upload className="w-4 h-4" />
            </label>
            <input 
              id="logo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleLogoChange}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Upload school logo<br />
            (PNG, JPG, max 2MB)
          </p>
        </div>
        
        <div className="flex-grow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="board"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Educational Board</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select board" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cbse">CBSE</SelectItem>
                          <SelectItem value="icse">ICSE</SelectItem>
                          <SelectItem value="state">State Board</SelectItem>
                          <SelectItem value="igcse">IGCSE</SelectItem>
                          <SelectItem value="ib">IB</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Academic Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select academic year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2023-2024">2023-2024</SelectItem>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SchoolInfoSettings;
