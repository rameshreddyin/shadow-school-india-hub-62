
// Define the structure of a time slot
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

// Define the structure of a subject
export interface Subject {
  id: string;
  name: string;
  code: string;
}

// Define the structure of a teacher
export interface Teacher {
  id: string;
  name: string;
  code: string;
}

// Define the structure of a period
export interface Period {
  subject: Subject;
  teacher: Teacher;
  timeSlot: TimeSlot;
}

// Define the structure of a day in the timetable
export interface TimetableDay {
  slots: Record<string, Period | null>;
}

// Define the structure of a timetable
export interface Timetable {
  days: Record<string, TimetableDay>;
}

// Class and Section type
export interface ClassSection {
  class: string;
  section: string;
}
