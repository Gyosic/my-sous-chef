import { Module } from "@nestjs/common";
import { CookingSessionGateway } from "./cooking-session.gateway";
import { CookingSessionService } from "./cooking-session.service";

@Module({
  providers: [CookingSessionGateway, CookingSessionService],
})
export class CookingSessionModule {}
