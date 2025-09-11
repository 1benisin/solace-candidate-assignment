import "dotenv/config";
import db from "../index";
import { advocates } from "../schema";
import { advocateData } from "./advocates";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    console.log("🧹 Clearing existing advocates...");
    await db.delete(advocates);

    // Insert new data
    console.log("📝 Inserting advocate data...");
    const insertedRecords = await db
      .insert(advocates)
      .values(advocateData)
      .returning();

    console.log(`✅ Successfully seeded ${insertedRecords.length} advocates!`);

    // Verify the data was inserted
    const totalCount = await db.select().from(advocates);
    console.log(`📊 Total advocates in database: ${totalCount.length}`);

    return { success: true, count: insertedRecords.length };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("🎉 Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export default seed;
