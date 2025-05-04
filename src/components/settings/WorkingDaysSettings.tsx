
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const days = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

const WorkingDaysSettings: React.FC = () => {
  const { toast } = useToast();
  // Default working days (Mon-Sat with Sunday off)
  const [workingDays, setWorkingDays] = useState<{[key: string]: boolean}>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });
  
  const [sessionStartMonth, setSessionStartMonth] = useState<string>("april");
  const [sessionEndMonth, setSessionEndMonth] = useState<string>("march");
  
  const handleToggleDay = (day: string) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, we would save the data to the server
    console.log("Saving working days:", workingDays);
    console.log("Session months:", { start: sessionStartMonth, end: sessionEndMonth });
    
    toast({
      title: "Settings Saved",
      description: "Working days settings have been updated successfully.",
    });
  };
  
  const getActiveDaysCount = () => {
    return Object.values(workingDays).filter(value => value).length;
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Working Days</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure which days of the week are working days for your school. Students and staff attendance will be tracked on these days.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {days.map((day) => (
            <div 
              key={day.id}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                workingDays[day.id] ? 'bg-primary/5 border-primary/20' : 'bg-muted/5'
              }`}
            >
              <Label htmlFor={`toggle-${day.id}`} className="font-medium cursor-pointer">
                {day.label}
              </Label>
              <Switch
                id={`toggle-${day.id}`}
                checked={workingDays[day.id]}
                onCheckedChange={() => handleToggleDay(day.id)}
              />
            </div>
          ))}
        </div>
        
        <p className="text-sm mt-4">
          <span className="font-medium">{getActiveDaysCount()}</span> working days per week
        </p>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Academic Session Period</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define the start and end months for your academic session.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="session-start">Session Start Month</Label>
            <Select 
              value={sessionStartMonth} 
              onValueChange={setSessionStartMonth}
            >
              <SelectTrigger id="session-start">
                <SelectValue placeholder="Select start month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="july">July</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="session-end">Session End Month</Label>
            <Select 
              value={sessionEndMonth} 
              onValueChange={setSessionEndMonth}
            >
              <SelectTrigger id="session-end">
                <SelectValue placeholder="Select end month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="december">December</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="may">May</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
    </div>
  );
};

export default WorkingDaysSettings;
