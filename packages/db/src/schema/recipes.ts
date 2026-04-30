import {
  pgTable,
  text,
  json,
  timestamp,
  real,
  integer,
  pgEnum,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

import { relations } from "drizzle-orm";

export const recipeSourceEnum = pgEnum("recipe_source", [
  "original", // 내가 직접 작성
  "forked", // 다른 사용자 레시피 저장
  "ai", // AI 생성
]);

export const recipes = pgTable("recipes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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
  source: recipeSourceEnum("source").notNull().default("original"),
  forkedFromId: text("forked_from_id").references(
    (): AnyPgColumn => recipes.id,
    { onDelete: "set null" },
  ),
  category_id: text().references(() => categories.id),
  like: integer().default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
  forkedFrom: one(recipes, {
    fields: [recipes.forkedFromId],
    references: [recipes.id],
    relationName: "fork",
  }),
  forks: many(recipes, {
    relationName: "fork", // 같은 이름으로 묶음
  }),
}));
