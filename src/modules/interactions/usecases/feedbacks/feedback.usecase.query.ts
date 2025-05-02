import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackResponse } from './feedback.response';
import { FeedbackEntity } from '../../persistence/feedbacks/feedback.entity';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
@Injectable()
export class FeedbackQuery {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
  ) {}
  async getFeedback(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<FeedbackResponse> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback not found with id ${id}`);
    }
    return FeedbackResponse.toResponse(feedback);
  }
  async getFeedbacks(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<FeedbackResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<FeedbackEntity>(
      this.feedbackRepository,
      query,
    );
    const d = new DataResponseFormat<FeedbackResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => FeedbackResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
