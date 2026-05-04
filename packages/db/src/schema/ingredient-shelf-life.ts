import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const ingredientShelfLife = pgTable("ingredient_shelf_life", {
  name: text("name").primaryKey(),
  days: integer("days").notNull(),
});

export type PrefixModifier = {
  type: "multiplier";
  value: number;
  max?: number;
};

export const PREFIX_MODIFIERS: { prefix: string; mod: PrefixModifier }[] = [
  { prefix: "냉동", mod: { type: "multiplier", value: 30, max: 365 } },

  { prefix: "건조", mod: { type: "multiplier", value: 10, max: 730 } },
  { prefix: "말린", mod: { type: "multiplier", value: 10, max: 730 } },

  { prefix: "다진", mod: { type: "multiplier", value: 0.5 } },
  { prefix: "갈은", mod: { type: "multiplier", value: 0.5 } },
  { prefix: "썬", mod: { type: "multiplier", value: 0.7 } },
  { prefix: "채썬", mod: { type: "multiplier", value: 0.7 } },

  { prefix: "삶은", mod: { type: "multiplier", value: 0.5 } },
  { prefix: "구운", mod: { type: "multiplier", value: 0.5 } },
  { prefix: "익힌", mod: { type: "multiplier", value: 0.5 } },
  { prefix: "조리된", mod: { type: "multiplier", value: 0.5 } },
];

export const SORTED_PREFIX_MODIFIERS = [...PREFIX_MODIFIERS].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);
