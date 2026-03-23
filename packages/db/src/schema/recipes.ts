import { pgTable, text, json, timestamp, real } from "drizzle-orm/pg-core";
import { users } from "./users";

export const recipes = pgTable("recipes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  steps: json("steps")
    .$type<{ title: string; description: string }[]>()
    .notNull(),
  ingredients: json("ingredients")
    .$type<{ name: string; amount: string; optional: boolean }[]>()
    .notNull(),
  units: json("units").$type<{ name: string; unit: string }[]>(),
  servings: real(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
