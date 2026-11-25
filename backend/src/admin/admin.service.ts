import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto, ReviewContentDto } from './dto/content-admin.dto';
import {
  ApprovalState,
  TopicStatus,
  ReviewDecision,
  ReviewState,
} from '@prisma/client';
import { isTrustedOfficialUrl } from '../common/utils/official-url';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createContent(dto: CreateTopicDto, creatorId: string) {
    if (dto.officialSourceUrl && !isTrustedOfficialUrl(dto.officialSourceUrl)) {
      throw new BadRequestException(
        'Official translation sources must use a trusted HTTPS government domain',
      );
    }

    let topic = await this.prisma.legalTopic.findUnique({
      where: { slug: dto.slug },
    });

    if (!topic) {
      topic = await this.prisma.legalTopic.create({
        data: {
          slug: dto.slug,
          category: dto.category,
          status: TopicStatus.DRAFT,
        },
      });
    }

    const content = await this.prisma.legalContent.create({
      data: {
        topicId: topic.id,
        jurisdiction: dto.jurisdiction,
        sourceReference: dto.sourceReference,
        approvalState: ApprovalState.IN_REVIEW,
        createdById: creatorId,
        translations: {
          create: {
            locale: dto.locale,
            title: dto.title,
            summary: dto.summary,
            body: dto.body,
            officialSourceUrl: dto.officialSourceUrl,
            reviewState: ReviewState.PENDING,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return {
      success: true,
      message: 'Draft content created and submitted for legal editorial review',
      content,
    };
  }

  async reviewContent(
    contentId: string,
    reviewerId: string,
    dto: ReviewContentDto,
  ) {
    const content = await this.prisma.legalContent.findUnique({
      where: { id: contentId },
      include: { topic: true },
    });

    if (!content) {
      throw new NotFoundException(`Content revision #${contentId} not found`);
    }

    const isApproved = dto.decision === ReviewDecision.APPROVED;

    // Record review audit entry
    await this.prisma.contentReview.create({
      data: {
        contentId,
        reviewerId,
        decision: dto.decision,
        notes: dto.notes,
      },
    });

    const updated = await this.prisma.legalContent.update({
      where: { id: contentId },
      data: {
        approvalState: isApproved
          ? ApprovalState.APPROVED
          : ApprovalState.REJECTED,
        approvedById: isApproved ? reviewerId : null,
      },
    });

    if (isApproved) {
      // Mark topic as published and translations as approved
      await this.prisma.legalTopic.update({
        where: { id: content.topicId },
        data: { status: TopicStatus.PUBLISHED },
      });

      await this.prisma.contentTranslation.updateMany({
        where: { contentId },
        data: {
          reviewState: ReviewState.APPROVED,
          reviewedById: reviewerId,
        },
      });
    }

    return {
      success: true,
      decision: dto.decision,
      updated,
    };
  }

  async getReviewQueue() {
    return this.prisma.legalContent.findMany({
      where: { approvalState: ApprovalState.IN_REVIEW },
      include: {
        topic: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        translations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuditLogs(limit: number = 100) {
    return this.prisma.auditLog.findMany({
      take: limit,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDashboardStats() {
    const [
      publishedGuides,
      pendingReviews,
      verifiedContacts,
      totalUsers,
      recentAuditLogs,
    ] = await Promise.all([
      this.prisma.legalTopic.count({
        where: { status: TopicStatus.PUBLISHED },
      }),
      this.prisma.legalContent.count({
        where: { approvalState: ApprovalState.IN_REVIEW },
      }),
      this.prisma.legalAidContact.count(),
      this.prisma.user.count(),
      this.prisma.auditLog.findMany({
        take: 8,
        include: { actor: { select: { name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      stats: {
        publishedGuides,
        pendingReviews,
        verifiedContacts,
        totalUsers,
        helplineActive: '15100',
        systemStatus: 'Healthy',
      },
      recentAuditLogs,
    };
  }
}
