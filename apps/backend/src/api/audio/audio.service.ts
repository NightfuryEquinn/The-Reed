import { S3Service } from "@/aws/s3/s3.service";
import { ErrorCode, ErrorResponseDto } from "@/common/dto/error-res.dto";
import { SuccessResponseDto } from "@/common/dto/success-res.dto";
import { KyselyService } from "@/kysely/kysely.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AudioService {
  constructor(
    private readonly db: KyselyService,
    private readonly s3Service: S3Service
  ) {}

  async upload(
    email: string,
    file: Express.Multer.File
  ) {
    await this.db.transaction().execute(async (trx) => {

      const user = await trx.selectFrom('user')
        .select(['id'])
        .where('email', '=', email)
        .executeTakeFirst()

      if (!user) {
        throw new ErrorResponseDto({
          message: 'User not found',
          statusCode: ErrorCode.NOT_FOUND
        })
      }

      const uploadedAudio = await this.s3Service.uploadSingleFile({
        file: file,
        isPublic: true
      })

      await trx.insertInto('audio_upload')
        .values({
          user_id: user.id,
          s3_key: uploadedAudio.key,
          s3_url: uploadedAudio.url,
          duration: Math.round(uploadedAudio.duration),
          file_format: uploadedAudio.fileFormat,
          created_at: new Date(),
          updated_at: new Date()
        })
        .execute()
    })

    return new SuccessResponseDto({
      message: 'Audio uploaded successfully',
      statusCode: 200
    })
  }

  async delete(
    userId: number,
    audioId: number
  ) {
    await this.db.transaction().execute(async (trx) => {
      const audio = await trx.selectFrom('audio_upload')
        .selectAll()
        .where('id', '=', audioId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (!audio) {
        throw new ErrorResponseDto({
          message: 'Audio not found',
          statusCode: ErrorCode.NOT_FOUND
        })
      }

      await this.s3Service.deleteFile(audio.s3_key)

      await trx.deleteFrom('audio_upload')
        .where('id', '=', audioId)
        .where('user_id', '=', userId)
        .executeTakeFirst()
    })

    return new SuccessResponseDto({
      message: 'Audio deleted successfully',
      statusCode: 200
    })
  }
}