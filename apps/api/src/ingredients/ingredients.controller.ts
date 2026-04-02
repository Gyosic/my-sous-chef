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
import { IngredientsService } from "./ingredients.service";
import {
  createIngredientDto,
  type CreateIngredientDto,
} from "./dto/create-ingredient.dto";
import {
  updateIngredientDto,
  type UpdateIngredientDto,
} from "./dto/update-ingredient.dto";
import { type AuthUser, JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "src/common/decorators/user.decorator";
import { UsersService } from "src/users/users.service";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";

@UseGuards(JwtAuthGuard)
@Controller("/api/ingredients")
export class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @User() user: AuthUser,
    @Body(new ZodValidationPipe(createIngredientDto)) body: CreateIngredientDto,
  ) {
    const { user: { id: userId } = {} } =
      await this.usersService.findOneByEmail(user.email);

    return this.ingredientsService.create({ ...body, userId: userId! });
  }

  @Get()
  async findAll(@User() user: AuthUser) {
    const { user: { id: userId } = {} } =
      await this.usersService.findOneByEmail(user.email);

    return this.ingredientsService.findAll({ userId: userId! });
  }

  @Patch(":id")
  async update(
    @User() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateIngredientDto))
    body: UpdateIngredientDto,
  ) {
    const { user: { id: userId } = {} } =
      await this.usersService.findOneByEmail(user.email);

    return this.ingredientsService.update({ id, userId: userId!, dto: body });
  }

  @Delete(":id")
  async remove(@User() user: AuthUser, @Param("id") id: string) {
    const { user: { id: userId } = {} } =
      await this.usersService.findOneByEmail(user.email);

    return this.ingredientsService.remove({ id, userId: userId! });
  }
}
