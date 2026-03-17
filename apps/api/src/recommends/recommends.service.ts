import { Injectable } from "@nestjs/common";
import { type RecommendType } from "./dto/recommend.dto";

@Injectable()
export class RecommendsService {
  recommendRecipe(query: RecommendType) {
    return `This action returns all recommends`;
  }
}
