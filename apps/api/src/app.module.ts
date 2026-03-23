import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "database/database.module";
import { RecommendsModule } from "./recommends/recommends.module";
import { AiModule } from "./ai/ai.module";
import { CookingSessionModule } from "./cooking-session/cooking-session.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AiModule,
    UsersModule,
    RecommendsModule,
    CookingSessionModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
