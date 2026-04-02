import { ingredientSchema } from "@repo/db/types/ingredients";
import z from "zod";

export const createIngredientDto = ingredientSchema;
export type CreateIngredientDto = z.infer<typeof createIngredientDto>;
