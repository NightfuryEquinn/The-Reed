import { KyselyService } from "@/kysely/kysely.service";
import { Injectable } from "@nestjs/common";
import { RequestRegisterDto } from "./dto/register.dto";
import { ErrorCode, ErrorResponseDto } from "@/common/dto/error-res.dto";
import { SuccessResponseDto } from "@/common/dto/success-res.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly db: KyselyService,
  ) {}

  async register(dto: RequestRegisterDto) {
    try {
      const existingUser = await this.db.selectFrom('user')
        .where('email', '=', dto.email)
        .selectAll()
        .executeTakeFirst();

      if (existingUser) {
        throw new ErrorResponseDto({
          message: 'User with this email already exists',
          statusCode: ErrorCode.CONFLICT,
        });
      }

      const user = await this.db.insertInto('user')
        .values({
          username: dto.username,
          email: dto.email,
          password: dto.password, // Note: In production, this should be hashed
          role: dto.role,
        })
        .execute();

      if (!user) {
        throw new ErrorResponseDto({
          message: 'Failed to register user',
          statusCode: ErrorCode.BAD_REQUEST,
        });
      }

      return new SuccessResponseDto({
        message: 'User registered successfully',
        statusCode: 200
      });
    } catch (error) {
      throw new ErrorResponseDto({
        message: 'Registration failed',
        statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}