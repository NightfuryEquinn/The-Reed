import { S3Service } from "@/aws/s3/s3.service";
import { ErrorCode, ErrorResponseDto } from "@/common/dto/error-res.dto";
import { SuccessResponseDto } from "@/common/dto/success-res.dto";
import { KyselyService } from "@/kysely/kysely.service";
import { InvokeEndpointCommand, SageMakerRuntimeClient } from "@aws-sdk/client-sagemaker-runtime";
import { Injectable } from "@nestjs/common";
import * as wav from 'node-wav'
import * as Meyda from 'meyda'
import { AudioDto, ResponseFetchAudioDto } from "./dto/fetch.dto";

@Injectable()
export class AudioService {
  private sageClient = new SageMakerRuntimeClient({ region: 'ap-southeast-5' })
  constructor(
    private readonly db: KyselyService,
    private readonly s3Service: S3Service,
  ) {}

  async fetch(
    email: string
  ) {
    const existingUser = await this.db.selectFrom('user')
      .select(["id"])
      .where('email', '=', email)
      .executeTakeFirst()

    if (!existingUser) {
      throw new ErrorResponseDto({
        message: 'User not found',
        statusCode: ErrorCode.NOT_FOUND
      })
    }

    const audio = await this.db.selectFrom('audio_upload')
      .selectAll()
      .where('user_id', '=', existingUser.id)
      .execute()

    return new ResponseFetchAudioDto({
      userId: existingUser.id,
      audio: audio.map((audio) => new AudioDto({
        ...audio,
        duration: audio.duration.toString(),
      }))
    })
  }

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
    audioId: number
  ) {
    await this.db.transaction().execute(async (trx) => {
      const audio = await trx.selectFrom('audio_upload')
        .selectAll()
        .where('id', '=', audioId)
        .executeTakeFirst()

      if (!audio) {
        throw new ErrorResponseDto({
          message: 'Audio not found',
          statusCode: ErrorCode.NOT_FOUND
        })
      }

      await this.s3Service.deleteFile(audio.s3_url)

      await trx.deleteFrom('audio_upload')
        .where('id', '=', audioId)
        .executeTakeFirst()
    })

    return new SuccessResponseDto({
      message: 'Audio deleted successfully',
      statusCode: 200
    })
  }

  async process(
    file: Express.Multer.File
  ) {
    const { channelData, sampleRate } = wav.decode(file.buffer)
    const audioBuffer = channelData[0]

    const features = Meyda.default.extract(
      ['mfcc', 'spectralCentroid'], 
      audioBuffer,
      sampleRate
    )

    const feedback = await this.analyzeAudio(features)

    return { feedback }
  }

  async processBase64(
    file: Express.Multer.File
  ) {
    const audioBase64 = file.buffer.toString('base64')
    const feedback = await this.analyzeAudio(undefined, audioBase64)

    return { feedback }
  }

  private async analyzeAudio(
    features?: any, 
    audioBase64?: string
  ) {
    const command = new InvokeEndpointCommand({
      EndpointName: 'the-reed-audio-analysis-endpoint',
      ContentType: 'application/json',
      Body: features ? JSON.stringify(features) : JSON.stringify({ audio: audioBase64})
    })

    const response = await this.sageClient.send(command)
    const result = new TextDecoder().decode(response.Body as Uint8Array)

    return JSON.parse(result)
  }
}