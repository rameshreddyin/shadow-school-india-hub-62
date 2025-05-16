import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Printer } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import PrintableCalendar from '@/components/academic-calendar/PrintableCalendar';
import '@/components/academic-calendar/PrintStyles.css';

// Types for calendar events
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'holiday' | 'event' | 'other';
  description?: string;
}

// Sample academic calendar events for an Indian school
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Republic Day',
    date: new Date(2025, 0, 26), // January 26, 2025
    type: 'holiday',
    description: 'National holiday celebrating the adoption of the Constitution of India'
  },
  {
    id: '2',
    title: 'Final Exams Begin',
    date: new Date(2025, 1, 25), // February 25, 2025
    type: 'exam',
    description: 'Annual final examinations for all classes'
  },
  {
    id: '3',
    title: 'Holi Celebration',
    date: new Date(2025, 2, 14), // March 14, 2025 (approximate date for 2025)
    type: 'holiday',
    description: 'Festival of colors'
  },
  {
    id: '4',
    title: 'Annual Sports Day',
    date: new Date(2025, 3, 5), // April 5, 2025
    type: 'event',
    description: 'Annual school sports competition'
  },
  {
    id: '5',
    title: 'Summer Vacation Begins',
    date: new Date(2025, 4, 15), // May 15, 2025
    type: 'holiday',
    description: 'Start of summer vacation'
  },
  {
    id: '6',
    title: 'New Academic Year',
    date: new Date(2025, 5, 10), // June 10, 2025
    type: 'event',
    description: 'Beginning of new academic year 2025-26'
  },
  {
    id: '7',
    title: 'Independence Day',
    date: new Date(2025, 7, 15), // August 15, 2025
    type: 'holiday',
    description: 'National holiday celebrating Indian independence'
  },
  {
    id: '8',
    title: 'Teachers Day',
    date: new Date(2025, 8, 5), // September 5, 2025
    type: 'event',
    description: 'Celebration honoring teachers'
  },
  {
    id: '9',
    title: 'Half-Yearly Exams',
    date: new Date(2025, 9, 10), // October 10, 2025
    type: 'exam',
    description: 'Mid-term examinations'
  },
  {
    id: '10',
    title: 'Diwali Break',
    date: new Date(2025, 10, 5), // November 5, 2025 (approximate date for 2025)
    type: 'holiday',
    description: 'Festival of lights celebration'
  },
];

const AcademicCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    date: new Date(),
    type: 'event',
  });
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<string>('all');
  
  const { toast } = useToast();
  const printableContentRef = useRef<HTMLDivElement>(null);

  const filteredEvents = events
    .filter(event => filterType === 'all' || event.type === filterType)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const dateHasEvent = (date: Date) => {
    return events.some(event => 
      date.getDate() === event.date.getDate() && 
      date.getMonth() === event.date.getMonth() &&
      date.getFullYear() === event.date.getFullYear()
    );
  };
  
  const eventsForSelectedDate = selectedDate ? events.filter(event => 
    selectedDate.getDate() === event.date.getDate() && 
    selectedDate.getMonth() === event.date.getMonth() &&
    selectedDate.getFullYear() === event.date.getFullYear()
  ) : [];

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast({
        title: "Error",
        description: "Event title is required",
        variant: "destructive",
      });
      return;
    }

    const event: CalendarEvent = {
      id: `${Date.now()}`,
      ...newEvent,
    };

    setEvents([...events, event]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      date: new Date(),
      type: 'event',
    });

    toast({
      title: "Event Added",
      description: `${event.title} has been added to the calendar`,
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been removed from the calendar",
    });
  };

  const handlePrint = () => {
    // Close the dialog if open
    setIsPrintPreviewOpen(false);
    
    // Let the dialog close, then print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'text-red-500 bg-red-100';
      case 'exam':
        return 'text-purple-500 bg-purple-100';
      case 'event':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <AppLayout title="Academic Calendar">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Academic Calendar</h2>
            <p className="text-muted-foreground">
              Manage academic events, holidays, and exams
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="holiday">Holidays</SelectItem>
                <SelectItem value="exam">Exams</SelectItem>
                <SelectItem value="event">School Events</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => setIsPrintPreviewOpen(true)}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>

            <Button onClick={() => setIsAddEventOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'calendar' | 'list')}>
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border pointer-events-auto"
                    modifiers={{
                      hasEvent: (date) => dateHasEvent(date)
                    }}
                    modifiersStyles={{
                      hasEvent: { 
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        color: 'var(--primary)'
                      }
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
                  </CardTitle>
                  <CardDescription>
                    Events for the selected date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDate.length > 0 ? (
                    <ul className="space-y-3">
                      {eventsForSelectedDate.map(event => (
                        <li 
                          key={event.id} 
                          className="p-3 rounded-md border flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.type)}`}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </span>
                              <h4 className="font-medium">{event.title}</h4>
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No events for this date</h3>
                      <p className="text-sm text-muted-foreground">
                        Select a different date or add a new event.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Academic Calendar Events</CardTitle>
                <CardDescription>
                  All {filterType === 'all' ? '' : filterType} events for the academic year
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map(event => (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                            <h4 className="font-medium text-lg">{event.title}</h4>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          )}
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <div className="text-right mr-4">
                            <div className="font-medium">{format(event.date, 'MMMM d, yyyy')}</div>
                            <div className="text-xs text-muted-foreground">{format(event.date, 'EEEE')}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No events found</h3>
                    <p className="text-sm text-muted-foreground">
                      {filterType !== 'all' 
                        ? `No ${filterType} events are scheduled. Try a different filter.` 
                        : 'No events are scheduled yet.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Event Dialog */}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Add a new event to the academic calendar
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input 
                  id="title" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Event Date</Label>
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => setNewEvent({...newEvent, date: date || new Date()})}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(value) => setNewEvent({...newEvent, type: value as CalendarEvent['type']})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="event">School Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print Preview Dialog */}
        <Dialog 
          open={isPrintPreviewOpen} 
          onOpenChange={setIsPrintPreviewOpen}
        >
          <DialogContent className="print-preview-container sm:max-w-[90%] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Calendar Print Preview</DialogTitle>
              <DialogDescription>
                Review how the calendar will appear when printed
              </DialogDescription>
            </DialogHeader>
            
            <div className="print-preview-scroll" ref={printableContentRef}>
              <PrintableCalendar 
                events={filteredEvents}
                filterType={filterType}
              />
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsPrintPreviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print Calendar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Hidden printable content for direct printing */}
        <div className="hidden">
          <div id="printable-content" className="print-calendar">
            <PrintableCalendar 
              events={filteredEvents}
              filterType={filterType}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AcademicCalendarPage;
