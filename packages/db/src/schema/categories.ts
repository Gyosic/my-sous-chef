import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const categoryTypeEnum = pgEnum("category_type", ["dish", "cuisine"]);

export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: categoryTypeEnum("type").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
