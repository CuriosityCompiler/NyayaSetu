import { ContentLocale, ReviewState } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChatQueryDto } from './dto/chat-query.dto';
import { ChatService } from './chat.service';
import {
  LanguageModelService,
  SupportedChatLocale,
} from './language-model.service';
import { isTrustedOfficialUrl } from '../common/utils/official-url';

const verifiedAt = new Date('2025-01-02T00:00:00.000Z');

function translation(
  locale: ContentLocale,
  officialSourceUrl: string | null = null,
) {
  return {
    locale,
    title:
      locale === ContentLocale.en
        ? 'Right to Information'
        : 'ಸ್ಥಳೀಯ ಭಾಷೆಯ ಮಾಹಿತಿ ಹಕ್ಕು',
    summary: 'The RTI process has a 30 day response period and a ₹10 fee.',
    body: 'Section 7 provides a 30 day response period. Keep % and & symbols unchanged.',
    reviewState: ReviewState.APPROVED,
    reviewedById: 'reviewer-1',
    officialSourceUrl,
    reviewedBy: { role: 'REVIEWER' },
  };
}

function topic(translations = [translation(ContentLocale.en)]) {
  return {
    slug: 'right-to-information-rti',
    category: 'Transparency & Governance',
    contents: [
      {
        id: 'content-1',
        jurisdiction: 'IN',
        sourceReference: 'Right to Information Act, 2005 · indiacode.nic.in',
        updatedAt: verifiedAt,
        translations,
      },
    ],
  };
}

function makeService(options?: {
  translations?: ReturnType<typeof translation>[];
  officialSources?: Array<{
    authority: string;
    url: string;
    lastVerified: Date | null;
  }>;
  legalAidContacts?: Array<{
    authority: string;
    state: string;
    district: string | null;
    phone: string;
    address: string;
    sourceUrl: string | null;
    lastVerified: Date | null;
  }>;
  model?: Partial<LanguageModelService>;
}) {
  const prisma = {
    legalTopic: {
      findMany: jest.fn().mockResolvedValue([topic(options?.translations)]),
    },
    officialSource: {
      findMany: jest.fn().mockResolvedValue(
        options?.officialSources || [
          {
            authority: 'India Code',
            url: 'https://indiacode.nic.in',
            lastVerified: verifiedAt,
          },
          {
            authority: 'National Legal Services Authority (NALSA)',
            url: 'https://nalsa.gov.in/legal-aid',
            lastVerified: verifiedAt,
          },
        ],
      ),
    },
    chatFeedback: { create: jest.fn() },
    legalAidContact: {
      findMany: jest.fn().mockResolvedValue(options?.legalAidContacts || []),
    },
  } as unknown as PrismaService;

  const model = {
    translateQuestionToEnglish: jest.fn().mockResolvedValue('RTI process'),
    generateGroundedAnswer: jest
      .fn()
      .mockResolvedValue(
        'The approved process has a ₹10 fee, a 30 day period, and preserves % &.',
      ),
    translateAnswer: jest.fn(async (answer: string) => {
      const tokens =
        answer.match(/https?:\/\/\S+|[\d][\d,]*(?:\.\d+)?|[%&]/g) || [];
      return `மொழிபெயர்க்கப்பட்ட பதில் ${tokens.join(' ')}`;
    }),
    ...options?.model,
  } as unknown as LanguageModelService;

  return {
    service: new ChatService(prisma, model),
    model,
  };
}

describe('ChatService', () => {
  it.each<SupportedChatLocale>(['en', 'hi', 'kn', 'ta', 'te', 'mr'])(
    'returns translation provenance and verified citations for %s',
    async (locale) => {
      const translations =
        locale === 'en'
          ? [translation(ContentLocale.en)]
          : [
              translation(ContentLocale.en),
              translation(locale as ContentLocale),
            ];
      const { service } = makeService({ translations });

      const result = await service.handleQuery({
        message: 'Explain the RTI process',
        locale,
      } as ChatQueryDto);

      expect(result.translationStatus).toBe('human_reviewed');
      expect(result.jurisdiction).toBe('IN');
      expect(result.lastVerified).toBe(verifiedAt.toISOString());
      expect(result.citations.length).toBeGreaterThan(0);
      expect(
        result.citations.every((citation) =>
          isTrustedOfficialUrl(citation.url || ''),
        ),
      ).toBe(true);
    },
  );

  it('uses the local model when the requested approved translation is missing', async () => {
    const { service, model } = makeService();

    const result = await service.handleQuery({
      message: 'मुझे RTI प्रक्रिया बताएं',
      locale: 'hi',
    } as ChatQueryDto);

    expect(model.generateGroundedAnswer).toHaveBeenCalledTimes(1);
    expect(model.translateAnswer).toHaveBeenCalledTimes(1);
    expect(result.translationStatus).toBe('machine_translated');
    expect(result.answer).toContain('15100');
  });

  it.each<Exclude<SupportedChatLocale, 'en'>>(['hi', 'kn', 'ta', 'te', 'mr'])(
    'machine-translates approved English content into %s',
    async (locale) => {
      const { service, model } = makeService();

      const result = await service.handleQuery({
        message: 'Tell me about the RTI process',
        locale,
      } as ChatQueryDto);

      expect(model.translateAnswer).toHaveBeenCalledWith(
        expect.stringContaining('30 day'),
        locale,
      );
      expect(result.translationStatus).toBe('machine_translated');
      expect(result.answer).toContain('15100');
    },
  );

  it('marks official translations only when the translation has a trusted URL', async () => {
    const { service } = makeService({
      translations: [
        translation(ContentLocale.en),
        translation(ContentLocale.hi, 'https://indiacode.nic.in'),
      ],
    });

    const result = await service.handleQuery({
      message: 'Explain the RTI process',
      locale: 'hi',
    } as ChatQueryDto);

    expect(result.translationStatus).toBe('official_translation');
    expect(result.citations[0].url).toBe('https://indiacode.nic.in');
  });

  it('does not label an untrusted translation link as official', async () => {
    const { service } = makeService({
      translations: [
        translation(ContentLocale.en),
        translation(ContentLocale.hi, 'https://not-official.example'),
      ],
    });

    const result = await service.handleQuery({
      message: 'Explain the RTI process',
      locale: 'hi',
    } as ChatQueryDto);

    expect(result.translationStatus).toBe('human_reviewed');
    expect(
      result.citations.some((citation) =>
        citation.url?.includes('not-official.example'),
      ),
    ).toBe(false);
  });

  it('discards invalid citation URLs from source records', async () => {
    const { service } = makeService({
      officialSources: [
        {
          authority: 'Fake source',
          url: 'https://not-an-official-site.example',
          lastVerified: verifiedAt,
        },
      ],
    });

    const result = await service.handleQuery({
      message: 'Explain the RTI process',
      locale: 'en',
    } as ChatQueryDto);

    expect(
      result.citations.every((citation) =>
        isTrustedOfficialUrl(citation.url || ''),
      ),
    ).toBe(true);
    expect(
      result.citations.some((citation) =>
        citation.url?.includes('not-an-official-site.example'),
      ),
    ).toBe(false);
  });

  it('retrieves only verified regional legal-aid contacts', async () => {
    const contact = {
      authority: 'District Legal Services Authority',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      phone: '08012345678',
      address: 'District Court',
      sourceUrl: 'https://karnataka.nalsa.gov.in',
      lastVerified: verifiedAt,
    };
    const { service } = makeService({ legalAidContacts: [contact] });

    const result = await service.handleQuery({
      message: 'RTI and free legal aid',
      locale: 'en',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
    } as ChatQueryDto);

    expect(result.citations).toContainEqual(
      expect.objectContaining({
        title: contact.authority,
        phone: contact.phone,
        url: contact.sourceUrl,
      }),
    );
  });

  it('does not send unsupported locales to the model', async () => {
    const { service, model } = makeService();

    const result = await service.handleQuery({
      message: 'Explain the RTI process',
      locale: 'bn',
    } as ChatQueryDto);

    expect(result.translationStatus).toBe('translation_unavailable');
    expect(result.sourceText).toContain('Right to Information');
    expect(model.generateGroundedAnswer).not.toHaveBeenCalled();
  });

  it('returns approved source text when local translation fails', async () => {
    const { service } = makeService({
      model: {
        translateAnswer: jest
          .fn()
          .mockRejectedValue(new Error('local model offline')),
      },
    });

    const result = await service.handleQuery({
      message: 'मुझे RTI प्रक्रिया बताएं',
      locale: 'hi',
    } as ChatQueryDto);

    expect(result.translationStatus).toBe('translation_unavailable');
    expect(result.sourceText).toContain('Right to Information');
    expect(result.answer).toContain('अनुवादित उत्तर देना संभव नहीं है');
  });

  it('rejects translations that alter protected numbers or symbols', async () => {
    const { service } = makeService({
      model: {
        translateAnswer: jest.fn().mockResolvedValue('Translated 10'),
      },
    });

    const result = await service.handleQuery({
      message: 'Tell me about RTI',
      locale: 'hi',
    } as ChatQueryDto);

    expect(result.translationStatus).toBe('translation_unavailable');
    expect(result.sourceText).toContain('Right to Information');
  });
});
