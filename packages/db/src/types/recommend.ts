import z from "zod";

export const recommendSchema = z.object({
  ingredients: z.array(z.string()).min(1, "재료를 입력하세요"),
  model: z.enum(["claude", "openai"]).default("openai"),
  prompt: z.string().optional(),
});

export type RecommendType = z.infer<typeof recommendSchema>;
