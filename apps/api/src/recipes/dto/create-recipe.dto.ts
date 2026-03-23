import { recipeSchema } from "@repo/db/types/recipes";
import z from "zod";

export const createRecipeDto = recipeSchema;
export type CreateRecipeDto = z.infer<typeof createRecipeDto>;
