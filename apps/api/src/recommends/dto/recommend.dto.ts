import { recommendSchema } from "@repo/db/types/recommend";
import z from "zod";

export const recommendDto = recommendSchema.extend({
  ingredients: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string()).min(1, "재료를 1개 이상 입력해주세요")),
});

export type RecommendDto = z.infer<typeof recommendDto>;
