import { ApprovalState, ContentLocale, TopicStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RightsService } from './rights.service';

describe('RightsService', () => {
  it('only lists published topics with approved content and a usable translation', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = new RightsService({
      legalTopic: { findMany },
    } as unknown as PrismaService);

    await service.findAll({ locale: ContentLocale.hi });

    const options = findMany.mock.calls[0][0];
    const translatedApprovedContent = {
      approvalState: ApprovalState.APPROVED,
      translations: {
        some: {
          locale: { in: [ContentLocale.hi, ContentLocale.en] },
        },
      },
    };

    expect(options.where).toMatchObject({
      status: TopicStatus.PUBLISHED,
      contents: { some: translatedApprovedContent },
    });
    expect(options.include.contents.where).toEqual(translatedApprovedContent);
  });

  it('opens the newest approved content that has the requested or English translation', async () => {
    const findUnique = jest.fn().mockResolvedValue({
      status: TopicStatus.PUBLISHED,
      slug: 'published-guide',
      category: 'Fundamental Rights',
      contents: [
        {
          jurisdiction: 'IN',
          sourceReference: 'India Code',
          version: 1,
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
          approvedBy: null,
          translations: [
            {
              locale: ContentLocale.en,
              title: 'Published guide',
              summary: 'A guide',
              body: 'Guide details',
            },
          ],
        },
      ],
    });
    const service = new RightsService({
      legalTopic: { findUnique },
    } as unknown as PrismaService);

    await expect(
      service.findBySlug('published-guide', ContentLocale.hi),
    ).resolves.toMatchObject({ title: 'Published guide' });

    expect(findUnique.mock.calls[0][0].include.contents.where).toEqual({
      approvalState: ApprovalState.APPROVED,
      translations: {
        some: {
          locale: { in: [ContentLocale.hi, ContentLocale.en] },
        },
      },
    });
  });
});
