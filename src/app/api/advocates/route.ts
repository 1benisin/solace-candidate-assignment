import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import type { Advocate } from "../../../db/schema";
import { AdvocatesResponse } from "../../../types/advocate";
import { sql, desc, count, or, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Check if we have a database connection
    const hasDatabase = process.env.DATABASE_URL;

    const searchTerm = search.trim();

    if (hasDatabase) {
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

      // Extract the data without the totalCount field for validation
      const data = result.map(({ totalCount, ...advocate }) => advocate);

      const response: AdvocatesResponse<Advocate> = {
        data: data,
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
    } else {
      // Fallback to seed data for development
      let data = advocateData.map((a) => ({ ...a, createdAt: new Date() }));
      let totalCount = data.length;

      // Apply search filter if provided
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        data = data.filter((advocate) => {
          return (
            advocate.firstName.toLowerCase().includes(searchLower) ||
            advocate.lastName.toLowerCase().includes(searchLower) ||
            advocate.city.toLowerCase().includes(searchLower) ||
            advocate.degree.toLowerCase().includes(searchLower) ||
            advocate.specialties.some((specialty) =>
              specialty.toLowerCase().includes(searchLower)
            ) ||
            advocate.yearsOfExperience.toString().includes(search)
          );
        });
        totalCount = data.length;
      }

      // Apply pagination
      const paginatedData = data.slice(offset, offset + limit);

      const response: AdvocatesResponse<Advocate> = {
        data: paginatedData,
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
    }
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
