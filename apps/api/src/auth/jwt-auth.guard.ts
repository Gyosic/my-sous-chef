import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { jwtVerify } from "jose";
import { IS_PUBLIC_KEY } from "./public.decorator";

export type AuthUser = {
  id: string;
  email: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private secret: Uint8Array;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    const authSecret = this.configService.getOrThrow<string>("AUTH_SECRET");
    this.secret = new TextEncoder().encode(authSecret);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("인증되지 않은 요청입니다");
    }

    try {
      const { payload } = await jwtVerify(token, this.secret);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("인증되지 않은 요청입니다");
    }
  }

  private extractToken(request: {
    headers: { authorization?: string };
  }): string | null {
    const [type, token = null] =
      request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : null;
  }
}
