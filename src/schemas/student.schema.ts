
import { z } from "zod";

// Common validation patterns
const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

// Student schema
export const studentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  admissionNumber: z.string().trim().min(1, "Admission number is required"),
  class: z.string().trim().min(1, "Class is required"),
  section: z.string().trim().min(1, "Section is required"),
  rollNumber: z.string().trim().min(1, "Roll number is required"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please enter a valid date",
  }),
  parentName: z.string().trim().min(2, "Parent name must be at least 2 characters"),
  contactNumber: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email address").optional(),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
