import { RecipeInput } from "@repo/db/types/recipes";
import { z } from "zod";
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiProvider {
  generateRecipe(
    ingredients: string[],
    prompt: string,
    dishCategories: Map<string, string>,
    cuisineCategories: Map<string, string>,
  ): Promise<AiRecipeResponse>;

  streamCookingGuidance(
    systemPrompt: string,
    conversationHistory: ConversationMessage[],
    userMessage: string,
  ): AsyncGenerator<string, void, unknown>;
}

const DISH_SLUGS = [
  "main-side",
  "side-dish",
  "soup",
  "stew",
  "noodle",
  "rice",
  "dessert",
  "salad",
  "bread",
  "sauce",
  "kimchi",
  "drink",
] as const;

const CUISINE_SLUGS = [
  "korean",
  "western",
  "japanese",
  "chinese",
  "asian",
  "fusion",
] as const;

export const recipeAiSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
      optional: z.boolean(),
    }),
  ),
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  servings: z.number(),
  source: z.enum(["ai"]),
  dishSlug: z.enum(DISH_SLUGS), // 👈 이 값 외에는 거부
  cuisineSlug: z.enum(CUISINE_SLUGS),
});

export type AiRecipe = z.infer<typeof recipeAiSchema>;

export const AI_PROVIDER = Symbol("AI_PROVIDER");

export interface AiRecipeResponse {
  recipes: RecipeInput[];
}
