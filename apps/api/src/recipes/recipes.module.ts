import { Module } from "@nestjs/common";
import { RecipesService } from "./recipes.service";
import { RecipesController } from "./recipes.controller";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
