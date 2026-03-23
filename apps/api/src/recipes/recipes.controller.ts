import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { type CreateRecipeDto } from "./dto/create-recipe.dto";
import { type UpdateRecipeDto } from "./dto/update-recipe.dto";
import { type AuthUser, JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "src/common/decorators/user.decorator";
import { UsersService } from "src/users/users.service";

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
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    const { user: { id: userId } = {} } = await this.userService.findOneByEmail(
      user.email,
    );

    const data = await this.recipesService.create({
      ...createRecipeDto,
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

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recipesService.remove(+id);
  }
}
