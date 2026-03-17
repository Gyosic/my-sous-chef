import z from "zod";

export const recommendSchema = z.object({
  ingredients: z.string(),
  model: z.string(),
});

export type RecommendType = z.infer<typeof recommendSchema>;
