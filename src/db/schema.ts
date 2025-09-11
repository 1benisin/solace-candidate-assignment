import { sql } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    specialties: jsonb("specialties").$type<string[]>().default([]).notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    // Indexes for search performance
    index("first_name_idx").on(table.firstName),
    index("last_name_idx").on(table.lastName),
    index("city_idx").on(table.city),
    index("degree_idx").on(table.degree),
    index("experience_idx").on(table.yearsOfExperience),
    // Composite index for common search patterns
    index("name_search_idx").on(table.firstName, table.lastName),
    // Advanced indexes
    index("specialties_gin_idx").using("gin", table.specialties),
    index("experience_range_idx")
      .on(table.yearsOfExperience)
      .where(sql`${table.yearsOfExperience} > 0`),
    index("recent_advocates_idx")
      .on(table.createdAt)
      .where(sql`${table.createdAt} > now() - interval '1 year'`),
  ]
);

export type Advocate = typeof advocates.$inferSelect;
export type NewAdvocate = typeof advocates.$inferInsert;

export { advocates };

// Auto-generated schemas from Drizzle table definition
export const advocateSelectSchema = createSelectSchema(advocates);
export const advocateInsertSchema = createInsertSchema(advocates, {
  // Custom validations for specific fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  city: z.string().min(1, "City is required"),
  degree: z.string().min(1, "Degree is required"),
  yearsOfExperience: z
    .number()
    .int()
    .nonnegative("Years of experience must be non-negative"),
  phoneNumber: z.number().positive("Phone number must be positive"),
});
