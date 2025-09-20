import { UserRoles } from "@/common/types";
import { Controller, Delete, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { AudioService } from "./audio.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, UserPayload } from "../auth/decorators/current-user.decorator";
import { RequestUploadAudioDto } from "./dto/upload.dto";
import { CognitoAuthGuard } from "../auth/guards/cognito.guard";

@ApiTags('Audio')
@UseGuards(CognitoAuthGuard)
@Roles(UserRoles.BASSOONIST)
@Controller('audio')
export class AudioController {
  constructor(private audioService: AudioService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RequestUploadAudioDto })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File, 
    @CurrentUser() user: UserPayload
  ) {
    return this.audioService.upload(user.id, file);
  }

  @Delete(':audioId')
  async delete(
    @Param('audioId') audioId: string, 
    @CurrentUser() user: UserPayload
  ) {
    return this.audioService.delete(user.id, parseInt(audioId));
  }
}