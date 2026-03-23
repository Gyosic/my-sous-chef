import { recipeSchema } from "@repo/db/types/recipes";
import z from "zod";

export const updateRecipeDto = recipeSchema.extend({
  id: z.string("필수입력값 입니다.").min(1, "필수입력값 입니다."),
});
export type UpdateRecipeDto = z.infer<typeof updateRecipeDto>;
