import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { type CreateRecipeDto } from "./dto/create-recipe.dto";
import { type UpdateRecipeDto } from "./dto/update-recipe.dto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db/schema";
import { DRIZZLE } from "@/database/database.module";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";

@Injectable()
export class RecipesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(createRecipeDto: CreateRecipeDto & { userId: string }) {
    const [recipe] = await this.db
      .insert(schema.recipes)
      .values({ ...createRecipeDto, source: "original" })
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

  async findPublic({
    search,
    cursor,
    limit,
  }: {
    search?: string;
    cursor?: string;
    limit: number;
  }) {
    const conditions = [eq(schema.recipes.share, true)];

    if (search) {
      conditions.push(
        or(
          ilike(schema.recipes.name, `%${search}%`),
          ilike(schema.recipes.description, `%${search}%`),
        )!,
      );
    }

    if (cursor) {
      const commaIndex = cursor.indexOf(",");
      const cursorDate = cursor.slice(0, commaIndex);
      const cursorId = cursor.slice(commaIndex + 1);
      const cursorTime = new Date(cursorDate);
      conditions.push(
        or(
          lt(schema.recipes.createdAt, cursorTime),
          and(
            eq(schema.recipes.createdAt, cursorTime),
            lt(schema.recipes.id, cursorId),
          ),
        )!,
      );
    }

    const rows = await this.db
      .select({
        id: schema.recipes.id,
        name: schema.recipes.name,
        description: schema.recipes.description,
        steps: schema.recipes.steps,
        ingredients: schema.recipes.ingredients,
        servings: schema.recipes.servings,
        like: schema.recipes.like,
        createdAt: schema.recipes.createdAt,
        authorName: schema.users.name,
        authorImage: schema.users.image,
      })
      .from(schema.recipes)
      .leftJoin(schema.users, eq(schema.recipes.userId, schema.users.id))
      .where(and(...conditions))
      .orderBy(desc(schema.recipes.createdAt), desc(schema.recipes.id))
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const recipes = hasNext ? rows.slice(0, limit) : rows;

    const lastRecipe = recipes[recipes.length - 1];
    const nextCursor =
      hasNext && lastRecipe
        ? `${lastRecipe.createdAt.toISOString()},${lastRecipe.id}`
        : null;

    return { recipes, nextCursor };
  }

  async update(id: string, userId: string, data: UpdateRecipeDto) {
    const [recipe] = await this.db
      .update(schema.recipes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(schema.recipes.id, id), eq(schema.recipes.userId, userId)))
      .returning();

    if (!recipe) throw new NotFoundException("레시피를 찾을 수 없습니다.");

    return { recipe };
  }

  async remove(id: string, userId: string) {
    const [recipe] = await this.db
      .delete(schema.recipes)
      .where(and(eq(schema.recipes.id, id), eq(schema.recipes.userId, userId)))
      .returning();

    if (!recipe) throw new NotFoundException("레시피를 찾을 수 없습니다.");

    return { recipe };
  }

  async sync(userId: string, recipes: CreateRecipeDto[]) {
    if (recipes.length === 0) return { recipes: [] };

    const inserted = await this.db
      .insert(schema.recipes)
      .values(
        recipes.map((r) => ({ ...r, userId, source: "original" as const })),
      )
      .returning();

    return { recipes: inserted };
  }
}
