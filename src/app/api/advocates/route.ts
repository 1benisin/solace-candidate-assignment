import db from "../../../db";
import { advocates } from "../../../db/schema";
import {
  advocateResponseSchema,
  type Advocate,
  type AdvocatesResponse,
} from "../../../types/advocate";
import { sql, desc, count, or, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

// Input validation schema for query parameters
const queryParamsSchema = z.object({
  search: z.string().max(100).optional(), // Limit search query length
  page: z.number().int().positive().max(1000).default(1), // Reasonable page limits
  limit: z.number().int().positive().max(100).default(20), // Limit page size
});

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);

    // Validate and sanitize input parameters
    const rawParams = {
      search: searchParams.get("search") || "",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    const validation = queryParamsSchema.safeParse(rawParams);
    if (!validation.success) {
      return Response.json(
        { error: "Invalid query parameters", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { search, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    // Check if we have a database connection
    const hasDatabase = process.env.DATABASE_URL;

    const searchTerm = (search || "").trim();

    if (!hasDatabase) {
      return Response.json(
        { error: "Database connection not established" },
        { status: 500 }
      );
    }

    // Use Drizzle's type-safe operators
    const whereConditions = searchTerm
      ? or(
          ilike(advocates.firstName, `%${searchTerm}%`),
          ilike(advocates.lastName, `%${searchTerm}%`),
          ilike(advocates.city, `%${searchTerm}%`),
          ilike(advocates.degree, `%${searchTerm}%`),
          sql`${advocates.specialties}::text ILIKE ${`%${searchTerm}%`}`,
          sql`${advocates.yearsOfExperience}::text ILIKE ${`%${searchTerm}%`}`
        )
      : undefined;

    // Single query with window function for count (more efficient)
    const query = db
      .select({
        id: advocates.id,
        firstName: advocates.firstName,
        lastName: advocates.lastName,
        city: advocates.city,
        degree: advocates.degree,
        specialties: advocates.specialties,
        yearsOfExperience: advocates.yearsOfExperience,
        phoneNumber: advocates.phoneNumber,
        createdAt: advocates.createdAt,
        totalCount: sql<number>`count(*) over()`.as("totalCount"),
      })
      .from(advocates)
      .where(whereConditions)
      .orderBy(desc(advocates.createdAt))
      .limit(limit)
      .offset(offset);

    const result = await query;
    const totalCount = result[0]?.totalCount ?? 0;

    // Extract the data without the totalCount field
    const rawData = result.map(({ totalCount, ...advocate }) => advocate);

    // Validate each advocate record using Zod schema
    const validatedData = rawData.map((advocate) => {
      const validation = advocateResponseSchema.safeParse(advocate);
      if (!validation.success) {
        console.error("Data validation error:", validation.error);
        throw new Error(`Invalid advocate data: ${validation.error.message}`);
      }
      return validation.data;
    });

    const response: AdvocatesResponse<Advocate> = {
      data: validatedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
