import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUser } from "src/auth/jwt-auth.guard";

export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();

  return request?.user;
});
