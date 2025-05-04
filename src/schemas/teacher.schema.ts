
import { z } from "zod";

// Common validation patterns
const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

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
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
