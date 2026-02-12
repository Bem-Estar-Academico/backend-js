import { beforeAll } from "bun:test";
import { db } from "../db";
import { sql } from "drizzle-orm";

export async function resetDatabase() {
  const tables = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name != 'drizzle_migrations';
  `);

  for (const table of (tables.rows as any[])) {
    await db.execute(sql.raw(`TRUNCATE TABLE "${table.table_name}" RESTART IDENTITY CASCADE`));
  }
}

beforeAll(async () => {
  try {
    await resetDatabase();
  } catch (error) {
    console.error("Failed to reset database before tests:", error);
    process.exit(1);
  }
});
