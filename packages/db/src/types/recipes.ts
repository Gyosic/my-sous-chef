import z from "zod";

const stepSchema = z.object({
  title: z.string("필수입력값 입니다.").min(1, "필수입력값 입니다."),
  description: z.string("필수입력값 입니다.").min(1, "필수입력값 입니다."),
});
const ingredientSchema = z.object({
  name: z.string("필수입력값 입니다.").min(1, "필수입력값 입니다."),
  amount: z.string("필수입력값 입니다.").min(1, "필수입력값 입니다."),
  optional: z.boolean(),
});
const unitSchema = z.object({ name: z.string(), unit: z.string() });

export const recipeSchema = z.object({
  name: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "레시피 이름", type: "text" }),
  description: z
    .string()
    .optional()
    .meta({ name: "레시피 설명", type: "textarea" }),
  steps: z.array(stepSchema).meta({ name: "요리순서", type: "nested" }),
  ingredients: z.array(ingredientSchema).meta({ name: "재료", type: "nested" }),
  units: z
    .array(unitSchema)
    .optional()
    .meta({ name: "계량단위", type: "nested" }),
  servings: z.number().meta({ name: "인분", type: "number" }),
});

export type RecipeInput = z.input<typeof recipeSchema>;
