
import { z } from "zod";

// Common validation patterns
const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

// Subject schema
export const teacherSubjectSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required"),
  class: z.string().trim().min(1, "Class is required"),
  section: z.string().trim().min(1, "Section is required"),
});

// Availability schema
const availabilitySchema = z.object({
  available: z.boolean(),
  from: z.string().optional(),
  to: z.string().optional(),
});

// Staff type enum
export const staffTypeEnum = z.enum(['teacher', 'administrative', 'finance', 'housekeeping', 'security', 'other']);

// Base staff schema with common fields
const baseStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  employeeId: z.string().trim().min(1, "Employee ID is required"),
  staffType: staffTypeEnum,
  department: z.string().trim().min(1, "Department is required"),
  qualification: z.string().trim().min(1, "Qualification is required"),
  salary: z.number().min(0, "Salary must be a positive number").optional(),
  joinDate: z.date({
    required_error: "Join date is required",
    invalid_type_error: "Please enter a valid date",
  }),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  contactNumber: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  dob: z.date().optional(),
});

// Teacher schema without refinement
const baseTeacherSchema = baseStaffSchema.extend({
  role: z.string().trim().min(1, "Role is required"),
  subjects: z.array(teacherSubjectSchema).optional(),
  availability: z.record(
    z.string(),
    availabilitySchema
  ).optional(),
});

// Add refinement separately
export const teacherSchema = baseTeacherSchema.refine(data => {
  // If staff type is teacher, role is required
  return data.staffType !== 'teacher' || (data.staffType === 'teacher' && data.role);
}, {
  message: "Role is required for teachers",
  path: ["role"],
});

// Non-teaching staff schema
export const nonTeachingStaffSchema = baseStaffSchema.extend({
  jobTitle: z.string().trim().min(1, "Job title is required"),
  responsibilities: z.string().trim().min(1, "Responsibilities are required"),
  workSchedule: z.string().trim().optional(),
});

// Create specialized schemas for each staff type
const teacherStaffSchema = baseTeacherSchema.extend({ 
  staffType: z.literal('teacher') 
}).refine(data => {
  // If staff type is teacher, role is required
  return data.role && data.role.length > 0;
}, {
  message: "Role is required for teachers",
  path: ["role"],
});

const administrativeStaffSchema = nonTeachingStaffSchema.extend({ staffType: z.literal('administrative') });
const financeStaffSchema = nonTeachingStaffSchema.extend({ staffType: z.literal('finance') });
const housekeepingStaffSchema = nonTeachingStaffSchema.extend({ staffType: z.literal('housekeeping') });
const securityStaffSchema = nonTeachingStaffSchema.extend({ staffType: z.literal('security') });
const otherStaffSchema = nonTeachingStaffSchema.extend({ staffType: z.literal('other') });

// Unified schema that conditionally validates based on staff type
export const staffSchema = z.discriminatedUnion('staffType', [
  teacherStaffSchema,
  administrativeStaffSchema,
  financeStaffSchema,
  housekeepingStaffSchema,
  securityStaffSchema,
  otherStaffSchema
]);

export type TeacherFormValues = z.infer<typeof teacherSchema>;
export type NonTeachingStaffFormValues = z.infer<typeof nonTeachingStaffSchema>;
export type StaffFormValues = z.infer<typeof staffSchema>;
export type TeacherSubject = z.infer<typeof teacherSubjectSchema>;
export type StaffType = z.infer<typeof staffTypeEnum>;
