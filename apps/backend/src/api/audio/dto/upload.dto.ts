import { ApiProperty } from "@nestjs/swagger";

export class RequestUploadAudioDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file!: any;
}