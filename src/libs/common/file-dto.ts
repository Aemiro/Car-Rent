import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  originalName: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  size?: number;
}
