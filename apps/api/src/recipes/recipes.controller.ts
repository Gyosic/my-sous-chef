import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { createRecipeDto, type CreateRecipeDto } from "./dto/create-recipe.dto";
import { updateRecipeDto, type UpdateRecipeDto } from "./dto/update-recipe.dto";
import { type AuthUser, JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { Public } from "@/auth/public.decorator";
import { User } from "@/common/decorators/user.decorator";
import { UsersService } from "@/users/users.service";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";

@UseGuards(JwtAuthGuard)
@Controller("/api/recipes")
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  async create(
    @User() user: AuthUser,
    @Body(new ZodValidationPipe(createRecipeDto)) body: CreateRecipeDto,
  ) {
    const { user: { id: userId } = {} } = await this.userService.findOneByEmail(
      user.email,
    );

    const data = await this.recipesService.create({
      ...body,
      userId: userId!,
    });
    return data;
  }

  @Get()
  async findAll(@User() user: AuthUser) {
    const { user: { id: userId } = {} } = await this.userService.findOneByEmail(
      user.email,
    );

    const data = await this.recipesService.findAll({ userId: userId! });
    return data;
  }

  @Public()
  @Get("public")
  findPublic(
    @Query("search") search?: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
  ) {
    return this.recipesService.findPublic({
      search,
      cursor,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Post("sync")
  async sync(
    @User() user: AuthUser,
    @Body() body: { recipes: CreateRecipeDto[] },
  ) {
    const { user: { id: userId } = {} } = await this.userService.findOneByEmail(
      user.email,
    );

    return this.recipesService.sync(userId!, body.recipes);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @User() user: AuthUser,
    @Body(new ZodValidationPipe(updateRecipeDto)) body: UpdateRecipeDto,
  ) {
    const { user: { id: userId } = {} } = await this.userService.findOneByEmail(
      user.email,
    );

    return this.recipesService.update(id, userId!, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @User() user: AuthUser) {
    const { user: { id: userId } = {} } = await this.userService.findOneByEmail(
      user.email,
    );

    return this.recipesService.remove(id, userId!);
  }
}
