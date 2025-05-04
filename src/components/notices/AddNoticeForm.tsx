
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Notice } from '@/types/notice';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const noticeFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  body: z.string().min(10, { message: "Message body must be at least 10 characters" }),
  audience: z.enum(['all', 'teachers', 'students', 'parents']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  visibleFrom: z.date(),
  visibleUntil: z.date(),
  attachments: z.array(z.string()).optional(),
});

type NoticeFormValues = z.infer<typeof noticeFormSchema>;

const AddNoticeForm: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: '',
      body: '',
      audience: 'all',
      priority: 'medium',
      visibleFrom: new Date(),
      visibleUntil: new Date(new Date().setDate(new Date().getDate() + 7)),
      attachments: [],
    },
  });

  function onSubmit(data: NoticeFormValues) {
    // In a real app, you would send this data to an API
    const newNotice: Partial<Notice> = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'published',
      // Convert Date objects to ISO strings to match the Notice type
      visibleFrom: data.visibleFrom.toISOString(),
      visibleUntil: data.visibleUntil.toISOString(),
    };
    
    console.log(newNotice);
    
    toast({
      title: "Notice created",
      description: "Your notice has been published successfully.",
    });
    
    form.reset();
  }

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Notice title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Body</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the notice content..." 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="teachers">Teachers</SelectItem>
                        <SelectItem value="students">Students</SelectItem>
                        <SelectItem value="parents">Parents</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select who should see this notice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the importance level of this notice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="visibleFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Visible From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When should this notice first appear?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="visibleUntil"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Visible Until</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When should this notice expire?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachments (Coming soon)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="file"
                        disabled
                        className="cursor-not-allowed"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload any relevant files (PDF, images, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit">Publish Notice</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddNoticeForm;
