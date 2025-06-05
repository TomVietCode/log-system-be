import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";
import { RoleGuard } from "./guards/role.guard";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JWTAuthGuard, RoleGuard],
  exports: [AuthService, JWTAuthGuard, RoleGuard],
})

export class AuthModule {}