import z from "zod";

const stepSchema = z.object({
  title: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "단계 제목", type: "text", placeholder: "단계 제목" }),
  description: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({
      name: "설명",
      type: "textarea",
      placeholder: "상세 설명을 입력하세요",
    }),
});
const ingredientSchema = z.object({
  name: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "재료명", type: "text", placeholder: "재료명" }),
  amount: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "계량", type: "text", placeholder: "수량" }),
  optional: z
    .boolean("유효하지 않은 값 입니다.")
    .meta({
      name: "옵션",
      type: "toggle",
      placeholder: "옵션",
      default: false,
    }),
});
const unitSchema = z.object({
  name: z
    .string("유효하지 않은 값 입니다.")
    .meta({ name: "계량명", type: "text", placeholder: "1 스푼" }),
  unit: z
    .string("유효하지 않은 값 입니다.")
    .meta({ name: "단위", type: "text", placeholder: "15g" }),
});

export const recipeSchema = z.object({
  name: z
    .string("필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({ name: "레시피 이름", type: "text", placeholder: "예) 김치찌개" }),
  description: z.string().optional().meta({
    name: "설명",
    type: "textarea",
    placeholder: "레시피에 대한 간단 설명을 입력하세요",
  }),
  steps: z
    .array(stepSchema, "필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({
      name: "요리순서",
      type: "nested",
      nestedSchema: stepSchema,
      nestedDirection: "horizon",
      required: true,
    }),
  ingredients: z
    .array(ingredientSchema, "필수입력값 입니다.")
    .min(1, "필수입력값 입니다.")
    .meta({
      name: "재료",
      type: "nested",
      nestedSchema: ingredientSchema,
      required: true,
    }),
  units: z.array(unitSchema).optional().meta({
    name: "계량단위",
    type: "nested",
    nestedSchema: unitSchema,
    required: false,
  }),
  servings: z.coerce
    .number("숫자만 입력해주세요.")
    .meta({ name: "인분", type: "number", step: 0.5, default: 1 }),
});

export type RecipeInput = z.input<typeof recipeSchema>;
