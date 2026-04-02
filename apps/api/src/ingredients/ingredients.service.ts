import { Inject, Injectable } from "@nestjs/common";
import { type CreateIngredientDto } from "./dto/create-ingredient.dto";
import { type UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db/schema";
import { DRIZZLE } from "database/database.module";
import { and, eq } from "drizzle-orm";

@Injectable()
export class IngredientsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(dto: CreateIngredientDto & { userId: string }) {
    const { expiration, ...rest } = dto;
    const [ingredient] = await this.db
      .insert(schema.ingredients)
      .values({
        ...rest,
        expiration: expiration?.toISOString().substring(0, 10),
      })
      .returning();

    return { ingredient };
  }

  async findAll({ userId }: { userId: string }) {
    const ingredients = await this.db
      .select()
      .from(schema.ingredients)
      .where(eq(schema.ingredients.userId, userId));

    return { ingredients };
  }

  async findOne({ id, userId }: { id: string; userId: string }) {
    const [ingredient] = await this.db
      .select()
      .from(schema.ingredients)
      .where(
        and(
          eq(schema.ingredients.id, id),
          eq(schema.ingredients.userId, userId),
        ),
      );

    return { ingredient };
  }

  async update({
    id,
    userId,
    dto,
  }: {
    id: string;
    userId: string;
    dto: UpdateIngredientDto;
  }) {
    const { expiration, ...rest } = dto;
    const [ingredient] = await this.db
      .update(schema.ingredients)
      .set({
        ...rest,
        expiration: expiration?.toISOString().substring(0, 10),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.ingredients.id, id),
          eq(schema.ingredients.userId, userId),
        ),
      )
      .returning();

    return { ingredient };
  }

  async remove({ id, userId }: { id: string; userId: string }) {
    const [ingredient] = await this.db
      .delete(schema.ingredients)
      .where(
        and(
          eq(schema.ingredients.id, id),
          eq(schema.ingredients.userId, userId),
        ),
      )
      .returning();

    return { ingredient };
  }
}
