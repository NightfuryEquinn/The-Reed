import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNumber, IsString, ValidateNested } from "class-validator";

export class AudioDto {
  @ApiProperty()
  @IsNumber()
  id!: number

  @ApiProperty()
  @IsString()
  s3_key!: string

  @ApiProperty()
  @IsString()
  s3_url!: string

  @ApiProperty()
  @IsString()
  duration!: string

  @ApiProperty()
  @IsString()
  file_format!: string

  @ApiProperty()
  @IsDateString()
  created_at!: Date

  @ApiProperty()
  @IsDateString()
  updated_at!: Date

  constructor(data: AudioDto) {
    Object.assign(this, data)
  }
}

export class ResponseFetchAudioDto {
  @ApiProperty()
  @IsNumber()
  userId!: number

  @ApiProperty({ type: [AudioDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AudioDto)
  audio!: AudioDto[]

  constructor(data: ResponseFetchAudioDto) {
    Object.assign(this, data)
  }
}