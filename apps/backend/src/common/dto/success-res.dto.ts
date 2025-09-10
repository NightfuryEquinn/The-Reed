import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@Injectable()
export class SuccessResponseDto {
  @ApiProperty({ default: 'Success' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ default: 200 })
  @IsOptional()
  @IsNumber()
  statusCode?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  id?: number;

  constructor(dto?: Partial<SuccessResponseDto>) {
    this.message = dto?.message || 'Success';
    this.statusCode = dto?.statusCode || 200;
    this.id = dto?.id || 0;
  }
}
