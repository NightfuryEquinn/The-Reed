import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum OrderAccording {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginableDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ enum: OrderAccording })
  @IsOptional()
  @IsEnum(OrderAccording)
  order?: OrderAccording;

  constructor(dto?: Partial<PaginableDto>) {
    this.limit = dto?.limit || 20;
    this.page = dto?.page || 1;
    this.order = dto?.order || OrderAccording.ASC;
  }
}
