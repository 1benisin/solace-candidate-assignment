import { z } from "zod";

// Frontend-only Advocate Zod schema
export const advocateSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  degree: z.string().min(1, "Degree is required").trim(),
  specialties: z.array(z.string()).default([]),
  yearsOfExperience: z
    .number()
    .int()
    .nonnegative("Years of experience must be non-negative"),
  phoneNumber: z.number().positive("Phone number must be positive"),
  createdAt: z.date(),
});

// Infer the TypeScript type from the Zod schema
export type Advocate = z.infer<typeof advocateSchema>;

// Schema for API responses with additional validation
export const advocateResponseSchema = advocateSchema.extend({
  // Allow createdAt as string from API and transform to Date
  createdAt: z.union([z.date(), z.string().transform((str) => new Date(str))]),
});

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AdvocatesResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
}
