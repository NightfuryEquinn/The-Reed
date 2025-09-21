import { UserRoles } from "@/common/types";
import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser, UserPayload } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";
import { AudioService } from "./audio.service";
import { RequestUploadAudioDto } from "./dto/upload.dto";
import { ResponseFetchAudioDto } from "./dto/fetch.dto";

@ApiTags('Audio')
@UseGuards(CognitoAuthGuard)
@Roles(UserRoles.BASSOONIST)
@Controller('audio')
export class AudioController {
  constructor(private audioService: AudioService) {}

  @Get()
  @ApiOkResponse({ type: ResponseFetchAudioDto })
  async fetch(
    @CurrentUser() user: UserPayload
  ) {
    return this.audioService.fetch(user.email);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RequestUploadAudioDto })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File, 
    @CurrentUser() user: UserPayload
  ) {
    return this.audioService.upload(user.email, file);
  }

  @Delete(':audioId')
  async delete(
    @Param('audioId') audioId: string, 
  ) {
    return this.audioService.delete(parseInt(audioId));
  }
}