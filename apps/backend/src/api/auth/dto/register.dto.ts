import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches } from "class-validator";

export enum UserRoleType {
  ADMIN = 'admin',
  BASOONIST = 'bassoonist',
  MENTOR = 'mentor',
}

export class RequestRegisterDto {
  @ApiProperty()
  @IsString()
  username!: string

  @ApiProperty()
  @IsString()
  @IsEmail()
  email!: string

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
  })
  password!: string

  @ApiProperty()
  @IsString()
  role!: UserRoleType
}