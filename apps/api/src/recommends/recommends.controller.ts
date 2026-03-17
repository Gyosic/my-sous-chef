import { Controller, Get, Query } from "@nestjs/common";
import { RecommendsService } from "./recommends.service";
import { recommendSchema, type RecommendType } from "./dto/recommend.dto";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@Controller("recommends")
export class RecommendsController {
  constructor(private readonly recommendsService: RecommendsService) {}

  @Get()
  findRecipe(
    @Query(new ZodValidationPipe(recommendSchema))
    query: RecommendType,
  ) {
    return this.recommendsService.recommendRecipe(query);
  }
}
