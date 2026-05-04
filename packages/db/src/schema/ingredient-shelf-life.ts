import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const ingredientShelfLife = pgTable("ingredient_shelf_life", {
  name: text("name").primaryKey(),
  days: integer("days").notNull(),
});
