import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorators/role.decorator";

@Injectable()
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
    if (!user) {
      throw new ForbiddenException("User not found")
    }
    console.log(`(role.guard) User role: ${user.role}, Required roles: ${requiredRoles}`)
    const hasRole = requiredRoles.includes(user.role)
    if (!hasRole) {
      throw new ForbiddenException("Unauthorized")
    }
    
    return true
  }
}