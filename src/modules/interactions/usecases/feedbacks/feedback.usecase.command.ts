import {
  ArchiveFeedbackCommand,
  CreateFeedbackCommand,
} from './feedback.command';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackResponse } from './feedback.response';
import { FeedbackRepository } from '../../persistence/feedbacks/feedback.repository';
import { UserInfo } from '@lib/common/user-info';

@Injectable()
export class FeedbackCommand {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
  ) {}
  async createFeedback(
    command: CreateFeedbackCommand,
  ): Promise<FeedbackResponse> {
    const feedbackDomain = CreateFeedbackCommand.toEntity(command);
    feedbackDomain.createdBy = command?.currentUser?.id;
    feedbackDomain.updatedBy = command?.currentUser?.id;
    const feedback =
      await this.feedbackRepository.insert(feedbackDomain);
    return FeedbackResponse.toResponse(feedback);
  }
  async archiveFeedback(
    command: ArchiveFeedbackCommand,
  ): Promise<FeedbackResponse> {
    const feedbackDomain = await this.feedbackRepository.getById(
      command.id,
    );
    if (!feedbackDomain) {
      throw new NotFoundException(
        `Feedback not found with id ${command.id}`,
      );
    }
    feedbackDomain.deletedAt = new Date();
    feedbackDomain.deletedBy = command?.currentUser?.id;
    const result = await this.feedbackRepository.save(feedbackDomain);
    return FeedbackResponse.toResponse(result);
  }
  async restoreFeedback(
    id: string,
    currentUser: UserInfo,
  ): Promise<FeedbackResponse> {
    const feedbackDomain = await this.feedbackRepository.getById(
      id,
      [],
      true,
    );
    if (!feedbackDomain) {
      throw new NotFoundException(`Feedback not found with id ${id}`);
    }
    await this.feedbackRepository.restore(id);
    return FeedbackResponse.toResponse(feedbackDomain);
  }
  async deleteFeedback(
    id: string,
    currentUser: UserInfo,
  ): Promise<boolean> {
    const feedbackDomain = await this.feedbackRepository.getById(
      id,
      [],
      true,
    );
    if (!feedbackDomain) {
      throw new NotFoundException(`Feedback not found with id ${id}`);
    }
    const result = await this.feedbackRepository.delete(id);
    return result;
  }
}
