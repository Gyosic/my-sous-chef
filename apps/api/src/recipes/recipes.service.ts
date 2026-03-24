import { Inject, Injectable } from "@nestjs/common";
import { type CreateRecipeDto } from "./dto/create-recipe.dto";
import { type UpdateRecipeDto } from "./dto/update-recipe.dto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db/schema";
import { DRIZZLE } from "database/database.module";
import { eq } from "drizzle-orm";

@Injectable()
export class RecipesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(createRecipeDto: CreateRecipeDto & { userId: string }) {
    const [recipe] = await this.db
      .insert(schema.recipes)
      .values({ ...createRecipeDto, type: "db" })
      .returning();

    return { recipe };
  }

  async findAll({ userId }: { userId: string }) {
    const recipes = await this.db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.userId, userId));

    return { recipes };
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
