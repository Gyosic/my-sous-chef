import { Inject, Injectable } from "@nestjs/common";
import { type CreateRecipeDto } from "./dto/create-recipe.dto";
import { type UpdateRecipeDto } from "./dto/update-recipe.dto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db/schema";
import { DRIZZLE } from "database/database.module";

@Injectable()
export class RecipesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(createRecipeDto: CreateRecipeDto & { userId: string }) {
    const [recipe] = await this.db
      .insert(schema.recipes)
      .values(createRecipeDto)
      .returning();

    return { recipe };
  }

  findAll() {
    return `This action returns all recipes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
