import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { FileDto } from '@lib/common/file-dto';
import { Util } from '@lib/common/util';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@auth/decorators/allow-anonymous.decorator';

@Controller()
@ApiTags('/')
export class AppController {
  @Get('download-file')
  @AllowAnonymous()
  async downloadFile(
    @Query() file: FileDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    validate(file).then((errors) => {
      if (errors.length > 0) {
        throw new BadRequestException(`Bad request`);
      }
    });
    const stream = await Util.downloadFile(
      file,
      process.env.UPLOADED_FILES_DESTINATION,
      response,
      false,
    );

    response.set({
      'Content-Disposition': `inline; filename="${file.originalName}"`,
      'Content-Type': file.type,
    });

    return stream;
  }
}
