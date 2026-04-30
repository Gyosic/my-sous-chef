import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { recipes } from "./recipes";

export const likes = pgTable(
  "likes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    user_id: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipe_id: text()
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("likes_user_recipe_unique").on(t.user_id, t.recipe_id),
    index("likes_recipe_idx").on(t.recipe_id),
    index("likes_user_idx").on(t.user_id),
  ],
);
