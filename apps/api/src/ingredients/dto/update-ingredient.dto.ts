import { ingredientSchema } from "@repo/db/types/ingredients";
import z from "zod";

export const updateIngredientDto = ingredientSchema.partial();
export type UpdateIngredientDto = z.infer<typeof updateIngredientDto>;
