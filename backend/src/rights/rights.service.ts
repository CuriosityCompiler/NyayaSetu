import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryRightsDto } from './dto/query-rights.dto';
import { TopicStatus, ApprovalState, ContentLocale } from '@prisma/client';

@Injectable()
export class RightsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryRightsDto) {
    const locale = query.locale || ContentLocale.en;
    const contentWhere = {
      approvalState: ApprovalState.APPROVED,
      ...(query.jurisdiction ? { jurisdiction: query.jurisdiction } : {}),
      translations: {
        some: {
          locale: { in: [locale, ContentLocale.en] },
        },
      },
    };
    const where: any = {
      status: TopicStatus.PUBLISHED,
      contents: { some: contentWhere },
    };

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    const topics = await this.prisma.legalTopic.findMany({
      where,
      include: {
        contents: {
          where: contentWhere,
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            translations: {
              where: {
                locale: { in: [locale, ContentLocale.en] },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map topics with appropriate language translation and fallback
    const result = topics.map((topic) => {
      const activeContent = topic.contents[0] || null;
      let translation = activeContent?.translations.find((t) => t.locale === locale);
      const isFallback = !translation && locale !== ContentLocale.en;

      if (!translation) {
        translation = activeContent?.translations.find((t) => t.locale === ContentLocale.en);
      }

      return {
        id: topic.id,
        slug: topic.slug,
        category: topic.category,
        jurisdiction: activeContent?.jurisdiction || 'IN',
        sourceReference: activeContent?.sourceReference || null,
        title: translation?.title || topic.slug.replace(/-/g, ' ').toUpperCase(),
        summary: translation?.summary || '',
        locale: translation?.locale || ContentLocale.en,
        isTranslationFallback: isFallback,
        version: activeContent?.version || 1,
        updatedAt: activeContent?.updatedAt || topic.updatedAt,
      };
    });

    if (query.q) {
      const q = query.q.toLowerCase().trim();
      return result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async findBySlug(slug: string, locale: ContentLocale = ContentLocale.en) {
    const topic = await this.prisma.legalTopic.findUnique({
      where: { slug },
      include: {
        contents: {
          where: {
            approvalState: ApprovalState.APPROVED,
            translations: {
              some: {
                locale: { in: [locale, ContentLocale.en] },
              },
            },
          },
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            translations: {
              where: { locale: { in: [locale, ContentLocale.en] } },
            },
            createdBy: {
              select: { name: true, role: true },
            },
            approvedBy: {
              select: { name: true, role: true },
            },
          },
        },
      },
    });

    if (!topic || topic.status !== TopicStatus.PUBLISHED) {
      throw new NotFoundException(`Legal rights guide for '${slug}' was not found`);
    }

    const activeContent = topic.contents[0];
    if (!activeContent) {
      throw new NotFoundException(`No approved content available for '${slug}'`);
    }

    let translation = activeContent.translations.find((t) => t.locale === locale);
    const isFallback = !translation && locale !== ContentLocale.en;

    if (!translation) {
      translation = activeContent.translations.find((t) => t.locale === ContentLocale.en);
    }

    if (!translation) {
      throw new NotFoundException(`No approved translation found for this topic`);
    }

    return {
      id: topic.id,
      slug: topic.slug,
      category: topic.category,
      jurisdiction: activeContent.jurisdiction,
      sourceReference: activeContent.sourceReference,
      version: activeContent.version,
      title: translation.title,
      summary: translation.summary,
      body: translation.body,
      locale: translation.locale,
      isTranslationFallback: isFallback,
      verifiedBy: activeContent.approvedBy?.name || 'NALSA Verified Reviewer',
      lastVerified: activeContent.updatedAt,
    };
  }

  async getCategories() {
    const categories = await this.prisma.legalTopic.findMany({
      where: { status: TopicStatus.PUBLISHED },
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map((c) => c.category);
  }
}
