import { Injectable } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { type RecommendType } from "./dto/recommend.dto";

@Injectable()
export class RecommendsService {
  constructor(private aiService: AiService) {}

  async recommendRecipe(query: RecommendType) {
    return this.aiService.generateRecipe(
      query.model,
      query.ingredients,
      query.prompt ?? "",
    );
  }
}
