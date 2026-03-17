import { Injectable } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { type RecommendType } from "./dto/recommend.dto";

@Injectable()
export class RecommendsService {
  constructor(private aiService: AiService) {}

  async recommendRecipe(query: RecommendType) {
    const ingredients = query.ingredients.split(",").map((i) => i.trim());

    return this.aiService.generateRecipe(
      query.model,
      ingredients,
      query.prompt ?? "",
    );
  }
}
