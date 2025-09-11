import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    // Return a typed placeholder to avoid TS union issues in consumers
    return {} as unknown as ReturnType<typeof drizzle>;
  }

  // Connection pooling configuration for better performance
  const queryClient = postgres(process.env.DATABASE_URL, {
    max: 20, // Maximum number of connections in the pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
  });

  const db = drizzle(queryClient);
  return db;
};

export default setup();
