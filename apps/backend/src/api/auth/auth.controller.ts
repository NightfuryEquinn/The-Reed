import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RequestRegisterDto } from "./dto/register.dto";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RequestRegisterDto })
  async register(
    @Body() dto: RequestRegisterDto
  ) {
    return this.authService.register(dto);
  }
}