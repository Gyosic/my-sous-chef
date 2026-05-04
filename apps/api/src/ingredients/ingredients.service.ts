import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { type CreateIngredientDto } from "./dto/create-ingredient.dto";
import { type UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@repo/db/schema";
import { and, eq } from "drizzle-orm";
import { DRIZZLE } from "@/database/database.module";
import { ingredientShelfLife, SORTED_PREFIX_MODIFIERS } from "@repo/db/";
import { normalizeText } from "@/common/utils";

@Injectable()
export class IngredientsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(dto: CreateIngredientDto & { userId: string }) {
    const { expiration, purchaseDate, ...rest } = dto;
    const today = new Date();
    const purchaseTime = new Date(purchaseDate ?? today).getTime();
    const values = {
      ...rest,
      purchaseDate:
        purchaseDate?.toISOString().substring(0, 10) ??
        new Date(purchaseTime).toISOString().substring(0, 10),
      expiration: expiration?.toISOString().substring(0, 10),
    };

    if (!expiration) {
      const shelfLife = await this.findShelfLife(rest.name);
      const exirationTime =
        purchaseTime + (shelfLife || 0) * 24 * 60 * 60 * 1000;

      Object.assign(values, {
        expiration: new Date(exirationTime).toISOString().substring(0, 10),
      });
    }

    const [ingredient] = await this.db
      .insert(schema.ingredients)
      .values(values)
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
    const { expiration, purchaseDate, ...rest } = dto;
    const { ingredient: original } = await this.findOne({ id, userId });

    if (!original) throw new NotFoundException();

    const today = new Date();
    const purchaseTime = new Date(purchaseDate ?? today).getTime();

    const values = {
      ...rest,
      purchaseDate:
        purchaseDate?.toISOString().substring(0, 10) ??
        new Date(purchaseTime).toISOString().substring(0, 10),
      expiration: expiration?.toISOString().substring(0, 10),
      updatedAt: new Date(),
    };
    if (!expiration) {
      const shelfLife = await this.findShelfLife(rest?.name || original.name);
      const exirationTime =
        purchaseTime + (shelfLife || 0) * 24 * 60 * 60 * 1000;

      Object.assign(values, {
        expiration: new Date(exirationTime).toISOString().substring(0, 10),
      });
    }

    const [ingredient] = await this.db
      .update(schema.ingredients)
      .set(values)
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

  async findShelfLife(input: string): Promise<number | null> {
    const name = normalizeText(input);
    if (!name) return null;

    const [exact] = await this.db
      .select()
      .from(ingredientShelfLife)
      .where(eq(ingredientShelfLife.name, name));
    if (exact) return exact.days;

    for (const { prefix, mod } of SORTED_PREFIX_MODIFIERS) {
      if (!name.startsWith(prefix)) continue;

      const baseName = name.slice(prefix.length);
      if (!baseName) continue;

      const [base] = await this.db
        .select()
        .from(ingredientShelfLife)
        .where(eq(ingredientShelfLife.name, baseName));
      if (!base) continue;

      const computed = Math.max(1, Math.round(base.days * mod.value));
      return mod.max ? Math.min(computed, mod.max) : computed;
    }

    return null;
  }
}
