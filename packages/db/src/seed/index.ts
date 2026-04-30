import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";
import { CATEGORY_SEED } from "./data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const client = postgres(url, { ssl: "require" });
  const db = drizzle(client, { schema });

  console.log("🌱 Seeding categories...");

  await db
    .insert(schema.categories)
    .values(CATEGORY_SEED)
    .onConflictDoNothing({ target: schema.categories.slug });

  console.log(`✅ Seeded ${CATEGORY_SEED.length} categories`);

  await client.end();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
