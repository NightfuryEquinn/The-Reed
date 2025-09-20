import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CognitoAuthGuard } from "./guards/cognito.guard";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '30m' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, CognitoAuthGuard],
  exports: [CognitoAuthGuard]
})
export class AuthModule {}