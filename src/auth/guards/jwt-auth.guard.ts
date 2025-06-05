import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
  ) {
    super();
  }

  //Check if the route is public
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  //Handle auth errors
  handleRequest(err: any, user: any, info: any) {
    if(err || !user) {
      throw err || new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}