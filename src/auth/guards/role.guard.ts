import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorators/role.decorator";

export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) throw new ForbiddenException("User not found")

    const hasRole = () => user.roles.some((role) => requiredRoles.includes(role))
    if (!hasRole) {
      throw new ForbiddenException("You are not authorized to access this resource")
    }
    
    return true
  }
}