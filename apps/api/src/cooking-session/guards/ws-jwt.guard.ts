import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { jwtVerify } from "jose";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtGuard implements CanActivate {
  private secret: Uint8Array;

  constructor(private configService: ConfigService) {
    const authSecret = this.configService.getOrThrow<string>("AUTH_SECRET");
    this.secret = new TextEncoder().encode(authSecret);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new WsException("인증되지 않은 요청입니다");
    }

    try {
      const { payload } = await jwtVerify(token, this.secret);
      (client as any).user = payload;
      return true;
    } catch {
      throw new WsException("인증되지 않은 요청입니다");
    }
  }
}
