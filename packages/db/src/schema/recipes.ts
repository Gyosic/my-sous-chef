import { pgTable, text, json, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const recipes = pgTable("recipes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  steps: json("steps").$type<string[]>().notNull(),
  ingredients: json("ingredients").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
