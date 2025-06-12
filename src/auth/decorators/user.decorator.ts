import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/user/dtos";

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User

    return data ? user?.[data] : user;
  }
)