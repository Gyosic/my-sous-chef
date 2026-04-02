import z from "zod";

export const ingredientSchema = z.object({
  name: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "재료명", type: "text", placeholder: "예) 양파" }),
  amount: z.coerce
    .number("숫자만 입력해주세요.")
    .min(0, "0 이상이어야 합니다.")
    .meta({ name: "수량", type: "number", step: 1, default: 1 }),
  unit: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "단위", type: "text", placeholder: "예) 개, g, ml" }),
  expiration: z.coerce.date().optional().meta({
    name: "유통기한",
    type: "date",
    placeholder: "예) 2026-04-30",
    required: false,
  }),
});

export type IngredientInput = z.input<typeof ingredientSchema>;
export type IngredientOutput = z.output<typeof ingredientSchema>;
