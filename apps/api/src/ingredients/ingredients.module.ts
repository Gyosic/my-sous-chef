import { Module } from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { IngredientsController } from "./ingredients.controller";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
