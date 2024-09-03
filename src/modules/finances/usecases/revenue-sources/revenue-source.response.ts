import { RevenueSourceEntity } from '@finance/persistence/revenue-sources/revenue-source.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RevenueSourceResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isActive?: boolean;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  deletedBy: string;
  static toResponse(entity: RevenueSourceEntity): RevenueSourceResponse {
    const response = new RevenueSourceResponse();
    response.id = entity.id;
    response.name = entity.name;
    response.code = entity.code;
    response.description = entity.description;

    response.isActive = entity.isActive;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
