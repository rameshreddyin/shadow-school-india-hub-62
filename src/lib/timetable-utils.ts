
import { Timetable, TimeSlot, Subject, Teacher } from '@/types/timetable';

// Mock data for time slots
export const mockTimeSlots: TimeSlot[] = [
  { id: '1-morning', startTime: '08:00', endTime: '08:45' },
  { id: '2-morning', startTime: '08:50', endTime: '09:35' },
  { id: '3-morning', startTime: '09:40', endTime: '10:25' },
  { id: '4-morning', startTime: '10:45', endTime: '11:30' },
  { id: '5-afternoon', startTime: '11:35', endTime: '12:20' },
  { id: '6-afternoon', startTime: '12:25', endTime: '13:10' },
];

// Mock data for subjects
export const mockSubjects: Subject[] = [
  { id: 'math', name: 'Mathematics', code: 'MATH' },
  { id: 'eng', name: 'English', code: 'ENG' },
  { id: 'sci', name: 'Science', code: 'SCI' },
  { id: 'ss', name: 'Social Studies', code: 'SS' },
  { id: 'hindi', name: 'Hindi', code: 'HIN' },
  { id: 'comp', name: 'Computer Science', code: 'CS' },
  { id: 'phys', name: 'Physical Education', code: 'PE' },
  { id: 'art', name: 'Art', code: 'ART' },
];

// Mock data for teachers
export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Rajesh Sharma', code: 'RSH' },
  { id: 't2', name: 'Priya Patel', code: 'PPT' },
  { id: 't3', name: 'Amit Kumar', code: 'AKR' },
  { id: 't4', name: 'Sunita Verma', code: 'SVR' },
  { id: 't5', name: 'Vijay Singh', code: 'VSG' },
  { id: 't6', name: 'Nisha Gupta', code: 'NGP' },
  { id: 't7', name: 'Deepak Joshi', code: 'DJS' },
  { id: 't8', name: 'Ananya Reddy', code: 'ARD' },
];

// Mock data for teacher subject assignments
export const mockTeacherSubjects: Record<string, string[]> = {
  't1': ['math', 'comp'],
  't2': ['eng', 'hindi'],
  't3': ['sci'],
  't4': ['ss', 'hindi'],
  't5': ['math', 'sci'],
  't6': ['eng', 'ss'],
  't7': ['comp', 'phys'],
  't8': ['art', 'eng'],
};

// Mock data for teacher availability
export const mockTeacherAvailability: Record<string, Record<string, string[]>> = {
  't1': {
    'monday': ['1-morning', '2-morning', '3-morning'],
    'tuesday': ['4-morning', '5-afternoon', '6-afternoon'],
    'wednesday': ['1-morning', '4-morning', '6-afternoon'],
    'thursday': ['2-morning', '3-morning', '5-afternoon'],
    'friday': ['1-morning', '3-morning', '5-afternoon'],
    'saturday': ['2-morning', '4-morning', '6-afternoon'],
  },
  // ... more teachers
};

// Generate an empty timetable with all days of the week and slots
export const generateEmptyTimetable = (): Timetable => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const slots = mockTimeSlots.map(slot => slot.id);
  
  const timetable: Timetable = {
    days: {}
  };
  
  days.forEach(day => {
    timetable.days[day] = {
      slots: {}
    };
    
    slots.forEach(slot => {
      timetable.days[day].slots[slot] = null;
    });
  });
  
  return timetable;
};

// Find teachers who teach a specific subject
export const findTeachersForSubject = (subjectId: string): Teacher[] => {
  return mockTeachers.filter(teacher => 
    mockTeacherSubjects[teacher.id]?.includes(subjectId)
  );
};

// Check if a teacher is available for a specific day and time slot
export const isTeacherAvailable = (
  teacherId: string, 
  day: string, 
  timeSlotId: string
): boolean => {
  // If we have specific availability data for this teacher
  if (mockTeacherAvailability[teacherId] && mockTeacherAvailability[teacherId][day]) {
    return mockTeacherAvailability[teacherId][day].includes(timeSlotId);
  }
  
  // Default to available if no specific data
  return true;
};

// Find all available teachers for a subject, day, and time slot
export const findAvailableTeachers = (
  subjectId: string, 
  day: string, 
  timeSlot: TimeSlot
): Teacher[] => {
  // First, find all teachers who teach this subject
  const subjectTeachers = findTeachersForSubject(subjectId);
  
  // Then filter by availability
  return subjectTeachers.filter(teacher => 
    isTeacherAvailable(teacher.id, day, timeSlot.id)
  );
};

// Helper function to check for scheduling conflicts
export const checkTeacherConflict = (
  timetable: Timetable,
  teacherId: string,
  day: string,
  timeSlotId: string,
  ignorePeriodAt?: { day: string, slot: string }
): boolean => {
  const dayData = timetable.days[day];
  if (!dayData) return false;
  
  return Object.entries(dayData.slots).some(([slotId, period]) => {
    // Skip the period we're currently editing
    if (ignorePeriodAt && ignorePeriodAt.day === day && ignorePeriodAt.slot === slotId) {
      return false;
    }
    
    // Check if this slot has the same teacher and overlaps with our time
    return period && 
           period.teacher.id === teacherId && 
           slotId === timeSlotId;
  });
};
