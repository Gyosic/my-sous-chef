import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "database/database.module";
import { RecommendsModule } from "./recommends/recommends.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    RecommendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
