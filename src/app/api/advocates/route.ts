import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { AdvocatesResponse } from "../../../types/advocate";

export async function GET(): Promise<Response> {
  try {
    // Uncomment this line to use a database
    // const data = await db.select().from(advocates);

    const data = advocateData;

    const response: AdvocatesResponse = { data };
    return Response.json(response);
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
