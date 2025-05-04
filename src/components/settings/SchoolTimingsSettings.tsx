
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PeriodTiming {
  id: string;
  periodNo: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

interface WorkingDays {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

const SchoolTimingsSettings: React.FC = () => {
  const { toast } = useToast();

  // Default working days
  const [workingDays, setWorkingDays] = useState<WorkingDays>({
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true
  });

  // Default period timings
  const defaultPeriodTimings: PeriodTiming[] = [
    { id: '1', periodNo: 1, label: 'Period 1', startTime: '08:00', endTime: '08:45', isBreak: false },
    { id: '2', periodNo: 2, label: 'Period 2', startTime: '08:50', endTime: '09:35', isBreak: false },
    { id: '3', periodNo: 3, label: 'Period 3', startTime: '09:40', endTime: '10:25', isBreak: false },
    { id: '4', periodNo: 4, label: 'Break', startTime: '10:25', endTime: '10:45', isBreak: true },
    { id: '5', periodNo: 5, label: 'Period 4', startTime: '10:45', endTime: '11:30', isBreak: false },
    { id: '6', periodNo: 6, label: 'Period 5', startTime: '11:35', endTime: '12:20', isBreak: false },
    { id: '7', periodNo: 7, label: 'Period 6', startTime: '12:25', endTime: '13:10', isBreak: false }
  ];

  const [periodTimings, setPeriodTimings] = useState<PeriodTiming[]>(defaultPeriodTimings);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  useEffect(() => {
    // Check if there have been changes from the initial state
    setIsFormChanged(true);
  }, [workingDays, periodTimings]);

  const handleDayToggle = (day: keyof WorkingDays) => {
    setWorkingDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleAddPeriod = () => {
    const lastPeriod = periodTimings[periodTimings.length - 1];
    const newPeriod: PeriodTiming = {
      id: Date.now().toString(),
      periodNo: lastPeriod ? lastPeriod.periodNo + 1 : 1,
      label: `Period ${lastPeriod ? lastPeriod.periodNo + 1 : 1}`,
      startTime: lastPeriod ? lastPeriod.endTime : '08:00',
      endTime: lastPeriod ? 
        incrementTime(lastPeriod.endTime, 45) : 
        incrementTime('08:00', 45),
      isBreak: false
    };
    setPeriodTimings([...periodTimings, newPeriod]);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriodTimings(periodTimings.filter(period => period.id !== id));
  };

  const handlePeriodChange = (id: string, field: keyof PeriodTiming, value: string | boolean | number) => {
    setPeriodTimings(periodTimings.map(period => {
      if (period.id === id) {
        // Update automatic label for non-break periods when period number changes
        if (field === 'periodNo' && !period.isBreak) {
          return { ...period, [field]: value, label: `Period ${value}` };
        }
        // Update label to "Break" when isBreak is toggled to true
        if (field === 'isBreak' && value === true) {
          return { ...period, [field]: value, label: 'Break' };
        }
        return { ...period, [field]: value };
      }
      return period;
    }));
  };

  const incrementTime = (time: string, minutesToAdd: number): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    // Here you would typically save to a backend or localStorage
    toast({
      title: "Settings Saved",
      description: "School timings have been updated successfully."
    });
    setIsFormChanged(false);
  };

  const handleReset = () => {
    setWorkingDays({
      sunday: false,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true
    });
    setPeriodTimings(defaultPeriodTimings);
    toast({
      title: "Settings Reset",
      description: "School timings have been reset to defaults."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Working Days</CardTitle>
          <CardDescription>
            Configure which days of the week the school is operational.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(workingDays) as Array<keyof WorkingDays>).map((day) => (
              <div 
                key={day} 
                className="flex items-center justify-between p-3 bg-background rounded-lg border"
              >
                <Label htmlFor={day} className="capitalize">{day}</Label>
                <Switch 
                  id={day}
                  checked={workingDays[day]}
                  onCheckedChange={() => handleDayToggle(day)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Period Timings</CardTitle>
          <CardDescription>
            Configure the period schedule for each school day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">No.</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead className="text-center">Break</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodTimings.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell>
                      <Input 
                        type="number"
                        min="1"
                        value={period.periodNo}
                        onChange={(e) => handlePeriodChange(period.id, 'periodNo', parseInt(e.target.value))}
                        className="w-16"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={period.label}
                        onChange={(e) => handlePeriodChange(period.id, 'label', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="time"
                        value={period.startTime}
                        onChange={(e) => handlePeriodChange(period.id, 'startTime', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="time"
                        value={period.endTime}
                        onChange={(e) => handlePeriodChange(period.id, 'endTime', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={period.isBreak}
                        onCheckedChange={(checked) => handlePeriodChange(period.id, 'isBreak', checked === true)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePeriod(period.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button 
            onClick={handleAddPeriod} 
            variant="outline" 
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Period
          </Button>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 bg-background py-4 px-2 border-t flex justify-end gap-4 shadow-md rounded-md">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={!isFormChanged}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SchoolTimingsSettings;
