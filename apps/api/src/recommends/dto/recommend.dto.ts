import z from "zod";

export const recommendSchema = z.object({
  ingredients: z.string(),
  model: z.enum(["claude", "openai"]).default("openai"),
  prompt: z.string().optional(),
});

export type RecommendType = z.infer<typeof recommendSchema>;
