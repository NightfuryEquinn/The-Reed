import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from 'uuid';
import * as mm from 'music-metadata';

@Injectable()
export class S3Service {
  private client: S3Client
  private bucketName: string
  private region: string
  
  constructor(
    private readonly configService: ConfigService
  ) {
    const s3_region = this.configService.get('S3_REGION')

    if (!s3_region) {
      throw new Error('S3_REGION not found in env.')
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET_KEY')
      },
      endpoint: this.configService.get('S3_ENDPOINT'),
      forcePathStyle: true
    })
  }

  async uploadSingleFile({
    file,
    isPublic = true
  }: {
    file: Express.Multer.File,
    isPublic: boolean
  }) {
    try {
      // Extract metadata from buffer
      const metadata = await mm.parseBuffer(file.buffer, file.mimetype);
      const duration = metadata.format.duration;

      const key = `${uuidv4()}`
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',
        Metadata: {
          originalName: file.originalname
        }
      })

      await this.client.send(command)

      return {
        url: isPublic
          ? (await this.getFileUrl(key)).url
          : (await this.getPresignedSignedUrl(key)).url,
        key,
        fileFormat: file.mimetype,
        duration,
        isPublic
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async getFileUrl(key: string) {
    return {
      url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`
    }
  }

  async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24
      })

      return { url }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: this.extractObjectKey(key)
      })

      await this.client.send(command)
      
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  extractObjectKey(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }
}