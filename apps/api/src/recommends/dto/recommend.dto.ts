import z from "zod";

export const recommendSchema = z.object({
  ingredients: z.preprocess(
    (val) =>
      typeof val === "string"
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : val,
    z.array(z.string()).min(1, "재료를 1개 이상 입력해주세요"),
  ),
  model: z.enum(["claude", "openai"]).default("openai"),
  prompt: z.string().optional(),
});

export type RecommendType = z.infer<typeof recommendSchema>;
