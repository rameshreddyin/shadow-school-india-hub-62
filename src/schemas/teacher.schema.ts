
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

// Teacher schema
export const teacherSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  employeeId: z.string().trim().min(1, "Employee ID is required"),
  role: z.string().trim().min(1, "Role is required"),
  department: z.string().trim().min(1, "Department is required"),
  qualification: z.string().trim().min(1, "Qualification is required"),
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
  subjects: z.array(teacherSubjectSchema).optional(),
  availability: z.record(
    z.string(),
    availabilitySchema
  ).optional(),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
export type TeacherSubject = z.infer<typeof teacherSubjectSchema>;
