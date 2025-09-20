import { Module } from "@nestjs/common";
import { AudioController } from "./audio.controller";
import { AudioService } from "./audio.service";
import { S3Service } from "@/aws/s3/s3.service";

@Module({
  controllers: [AudioController],
  providers: [AudioService, S3Service]
})
export class AudioModule {}