import { Controller, Get, Query } from "@nestjs/common";
import { RecommendsService } from "./recommends.service";
import { recommendDto, type RecommendDto } from "./dto/recommend.dto";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@Controller("/api/recommends")
export class RecommendsController {
  constructor(private readonly recommendsService: RecommendsService) {}

  @Get()
  findRecipe(
    @Query(new ZodValidationPipe(recommendDto))
    query: RecommendDto,
  ) {
    return this.recommendsService.recommendRecipe(query);
  }
}
