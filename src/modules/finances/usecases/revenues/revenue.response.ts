import { RevenueEntity } from '@finance/persistence/revenues/revenue.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RevenueSourceResponse } from '../revenue-sources/revenue-source.response';

export class RevenueResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  sourceId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  revenueDate?: Date;
  @ApiProperty()
  status?: string;
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
  source?: RevenueSourceResponse;
  static toResponse(entity: RevenueEntity): RevenueResponse {
    const response = new RevenueResponse();
    response.id = entity.id;
    response.amount = entity.amount;
    response.sourceId = entity.sourceId;
    response.description = entity.description;
    response.revenueDate = entity.revenueDate;
    response.status = entity.status;

    response.status = entity.status;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    if (entity.source) {
      response.source = RevenueSourceResponse.toResponse(entity.source);
    }
    return response;
  }
}
