import { Injectable } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { type RecommendDto } from "./dto/recommend.dto";

@Injectable()
export class RecommendsService {
  constructor(private aiService: AiService) {}

  async recommendRecipe(query: RecommendDto) {
    return this.aiService.generateRecipe(
      query.model,
      query.ingredients,
      query.prompt ?? "",
    );
  }
}
