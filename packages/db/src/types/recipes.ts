import z from "zod";

const stepSchema = z.object({
  title: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "타이틀", type: "text" }),
  description: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "설명", type: "textarea" }),
});
const ingredientSchema = z.object({
  name: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "재료명", type: "text" }),
  amount: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "계량", type: "text", placeholder: "1 스푼 or 15g" }),
  optional: z.boolean().meta({ name: "선택", type: "boolean" }),
});
const unitSchema = z.object({
  name: z
    .string()
    .meta({ name: "계량명", type: "text", placeholder: "1 스푼" }),
  unit: z.string().meta({ name: "단위", type: "text", placeholder: "15g" }),
});

export const recipeSchema = z.object({
  name: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "레시피 이름", type: "text" }),
  description: z
    .string()
    .optional()
    .meta({ name: "레시피 설명", type: "textarea" }),
  steps: z
    .array(stepSchema)
    .meta({ name: "요리순서", type: "nested", element: stepSchema.shape }),
  ingredients: z
    .array(ingredientSchema)
    .meta({ name: "재료", type: "nested", element: ingredientSchema.shape }),
  units: z
    .array(unitSchema)
    .optional()
    .meta({ name: "계량단위", type: "nested", element: unitSchema.shape }),
  servings: z.number().meta({ name: "인분", type: "number" }),
});

export type RecipeInput = z.input<typeof recipeSchema>;
