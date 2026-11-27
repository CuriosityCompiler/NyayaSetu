import { Injectable, Logger } from '@nestjs/common';
import {
  ApprovalState,
  ContentLocale,
  ReviewState,
  TopicStatus,
  VerificationStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { isTrustedOfficialUrl } from '../common/utils/official-url';
import { ChatFeedbackDto, ChatQueryDto } from './dto/chat-query.dto';
import {
  GroundingSource,
  LanguageModelService,
  SupportedChatLocale,
} from './language-model.service';

const SUPPORTED_LOCALES: readonly SupportedChatLocale[] = [
  'en',
  'hi',
  'kn',
  'ta',
  'te',
  'mr',
];

const HELPLINE_SENTENCES: Record<SupportedChatLocale, string> = {
  en: 'If your matter is urgent, please call the National Legal Aid Helpline directly at 15100 (toll-free 24x7).',
  hi: 'यदि आपका मामला अत्यावश्यक है, तो कृपया राष्ट्रीय कानूनी सहायता हेल्पलाइन 15100 पर सीधे कॉल करें (टोल-फ्री 24x7)।',
  kn: 'ನಿಮ್ಮ ವಿಷಯ ತುರ್ತಾಗಿದ್ದರೆ, ದಯವಿಟ್ಟು ರಾಷ್ಟ್ರೀಯ ಕಾನೂನು ನೆರವು ಸಹಾಯವಾಣಿ 15100ಕ್ಕೆ ನೇರವಾಗಿ ಕರೆಮಾಡಿ (ಟೋಲ್-ಫ್ರೀ 24x7).',
  ta: 'உங்கள் பிரச்சினை அவசரமானது என்றால், தேசிய சட்ட உதவி அழைப்பு எண் 15100-ஐ நேரடியாக அழைக்கவும் (கட்டணமில்லா 24x7).',
  te: 'మీ విషయం అత్యవసరమైతే, జాతీయ న్యాయ సహాయ హెల్ప్‌లైన్ 15100కు నేరుగా కాల్ చేయండి (టోల్-ఫ్రీ 24x7).',
  mr: 'तुमची बाब तातडीची असल्यास, कृपया राष्ट्रीय विधी सहाय्य हेल्पलाइन 15100 वर थेट कॉल करा (टोल-फ्री 24x7).',
};

const EMERGENCY_NOTICES: Record<SupportedChatLocale, string> = {
  en: 'If you are in immediate danger, call 112 now. Women’s Helpline: 181. Childline: 1098.',
  hi: 'यदि आप तत्काल खतरे में हैं, तो अभी 112 पर कॉल करें। महिला हेल्पलाइन: 181। चाइल्डलाइन: 1098।',
  kn: 'ನೀವು ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿದ್ದರೆ, ಈಗಲೇ 112ಕ್ಕೆ ಕರೆಮಾಡಿ. ಮಹಿಳಾ ಸಹಾಯವಾಣಿ: 181. ಮಕ್ಕಳ ಸಹಾಯವಾಣಿ: 1098.',
  ta: 'உடனடி ஆபத்தில் இருந்தால், இப்போது 112-ஐ அழைக்கவும். பெண்கள் உதவி எண்: 181. குழந்தைகள் உதவி எண்: 1098.',
  te: 'మీరు తక్షణ ప్రమాదంలో ఉంటే, వెంటనే 112కు కాల్ చేయండి. మహిళా హెల్ప్‌లైన్: 181. చైల్డ్‌లైన్: 1098.',
  mr: 'तुम्ही तात्काळ धोक्यात असल्यास, आत्ताच 112 वर कॉल करा. महिला हेल्पलाइन: 181. चाइल्डलाइन: 1098.',
};

const FALLBACK_NOTICES: Record<SupportedChatLocale, string> = {
  en: `I could not safely provide a translated answer right now. The approved source-language information is shown below. ${HELPLINE_SENTENCES.en}`,
  hi: `अभी सुरक्षित अनुवादित उत्तर देना संभव नहीं है। नीचे स्वीकृत मूल-भाषा की जानकारी दी गई है। ${HELPLINE_SENTENCES.hi}`,
  kn: `ಈಗ ಸುರಕ್ಷಿತವಾಗಿ ಅನುವಾದಿಸಿದ ಉತ್ತರವನ್ನು ನೀಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಅನುಮೋದಿತ ಮೂಲ ಭಾಷೆಯ ಮಾಹಿತಿಯನ್ನು ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ. ${HELPLINE_SENTENCES.kn}`,
  ta: `இப்போது பாதுகாப்பான மொழிபெயர்க்கப்பட்ட பதிலை வழங்க முடியவில்லை. அங்கீகரிக்கப்பட்ட மூல மொழித் தகவல் கீழே உள்ளது. ${HELPLINE_SENTENCES.ta}`,
  te: `ప్రస్తుతం సురక్షితమైన అనువాద సమాధానాన్ని ఇవ్వలేకపోయాను. ఆమోదించిన మూల భాష సమాచారం క్రింద ఉంది. ${HELPLINE_SENTENCES.te}`,
  mr: `सध्या सुरक्षितपणे भाषांतरित उत्तर देता आले नाही. मंजूर मूळ-भाषेतील माहिती खाली दिली आहे. ${HELPLINE_SENTENCES.mr}`,
};

export interface Citation {
  title: string;
  authority: string;
  url?: string;
  phone?: string;
  address?: string;
  jurisdiction: string;
  lastVerified?: string;
}

export interface ChatQueryResponse {
  answer: string;
  sourceText?: string;
  citations: Citation[];
  jurisdiction: string;
  lastVerified?: string;
  sourceLanguage: string;
  translationStatus:
    | 'human_reviewed'
    | 'official_translation'
    | 'machine_translated'
    | 'translation_unavailable';
  isTranslationFallback: boolean;
  isEmergency: boolean;
  suggestedActions: string[];
}

interface MatchedContent {
  topic: {
    slug: string;
    category: string;
  };
  content: {
    id: string;
    jurisdiction: string;
    sourceReference: string | null;
    updatedAt: Date;
    translations: Array<{
      locale: ContentLocale;
      title: string;
      summary: string;
      body: string;
      reviewState: ReviewState;
      reviewedById: string | null;
      officialSourceUrl: string | null;
      reviewedBy: { role: string } | null;
    }>;
  };
  answerTranslation: MatchedContent['content']['translations'][number];
  sourceTranslation: MatchedContent['content']['translations'][number];
  score: number;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly languageModel: LanguageModelService,
  ) {}

  async handleQuery(
    dto: ChatQueryDto,
    userId?: string,
  ): Promise<ChatQueryResponse> {
    const localeValue = dto.locale || ContentLocale.en;
    const locale = isSupportedLocale(localeValue) ? localeValue : undefined;
    const message = dto.message.trim();
    const isEmergency = isEmergencyQuestion(message);

    const aidQuery = isLegalAidQuestion(message);
    const [topics, officialSources, legalAidContacts] = await Promise.all([
      this.prisma.legalTopic.findMany({
        where: { status: TopicStatus.PUBLISHED },
        include: {
          contents: {
            where: { approvalState: ApprovalState.APPROVED },
            orderBy: { version: 'desc' },
            take: 1,
            include: {
              translations: {
                where: { reviewState: ReviewState.APPROVED },
                include: {
                  reviewedBy: { select: { role: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.officialSource.findMany({
        where: { lastVerified: { not: null } },
        orderBy: { lastVerified: 'desc' },
        select: {
          authority: true,
          url: true,
          lastVerified: true,
        },
      }),
      aidQuery
        ? this.prisma.legalAidContact.findMany({
            where: {
              verificationStatus: VerificationStatus.VERIFIED,
              ...(dto.state
                ? { state: { equals: dto.state, mode: 'insensitive' as const } }
                : {}),
              ...(dto.district
                ? {
                    district: {
                      equals: dto.district,
                      mode: 'insensitive' as const,
                    },
                  }
                : {}),
            },
            orderBy: { lastVerified: 'desc' },
            take: 3,
            select: {
              authority: true,
              state: true,
              district: true,
              phone: true,
              address: true,
              sourceUrl: true,
              lastVerified: true,
            },
          })
        : Promise.resolve([]),
    ]);
    const legalAidCitations: Citation[] = legalAidContacts.map((contact) => ({
      title: contact.authority,
      authority: `${contact.state}${contact.district ? ` - ${contact.district}` : ''}`,
      ...(contact.sourceUrl && isTrustedOfficialUrl(contact.sourceUrl)
        ? { url: contact.sourceUrl }
        : {}),
      phone: contact.phone,
      address: contact.address,
      jurisdiction: 'IN',
      ...(contact.lastVerified
        ? { lastVerified: contact.lastVerified.toISOString() }
        : {}),
    }));

    const baseMatches = topics.flatMap((topic) => {
      const content = topic.contents[0];
      if (!content) {
        return [];
      }

      const english = content.translations.find(
        (translation) => translation.locale === ContentLocale.en,
      );
      const localized = locale
        ? content.translations.find(
            (translation) => translation.locale === locale,
          )
        : undefined;
      const sourceTranslation = english || localized;
      const answerTranslation = localized || english;

      if (!sourceTranslation || !answerTranslation) {
        return [];
      }

      return [
        {
          topic,
          content,
          answerTranslation,
          sourceTranslation,
        },
      ];
    });

    const rankMatches = (query: string): MatchedContent[] => {
      const searchTerms = tokenize(query);
      return baseMatches
        .map((candidate) => {
          const searchableText = [
            candidate.topic.slug.replace(/-/g, ' '),
            candidate.topic.category,
            ...candidate.content.translations.flatMap((translation) => [
              translation.title,
              translation.summary,
              translation.body,
            ]),
          ]
            .join(' ')
            .toLocaleLowerCase();
          const score = searchTerms.reduce(
            (total, term) => total + (searchableText.includes(term) ? 1 : 0),
            0,
          );
          return {
            ...candidate,
            score,
          };
        })
        .filter((candidate) => candidate.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, 3);
    };

    let searchMessage = message;
    let ranked = rankMatches(message);
    if (!ranked.length && locale && locale !== 'en') {
      try {
        searchMessage = await this.languageModel.translateQuestionToEnglish(
          message,
          locale,
        );
        ranked = rankMatches(`${message} ${searchMessage}`);
      } catch (error) {
        this.logger.warn(
          `Local question translation failed: ${errorMessage(error)}`,
        );
      }
    }

    const match = ranked[0];
    if (!match) {
      return this.unmatchedResponse(
        locale,
        localeValue,
        officialSources,
        isEmergency,
        legalAidCitations,
      );
    }

    const citations = [
      ...this.buildCitations(match, officialSources),
      ...legalAidCitations,
    ];
    const jurisdiction = match.content.jurisdiction || 'IN';
    const lastVerified = latestVerifiedDate(citations);
    const reviewerApproved =
      match.answerTranslation.reviewState === ReviewState.APPROVED &&
      Boolean(match.answerTranslation.reviewedById) &&
      ['REVIEWER', 'ADMIN'].includes(
        match.answerTranslation.reviewedBy?.role || '',
      );
    const officialTranslationUrl =
      match.answerTranslation.officialSourceUrl &&
      isTrustedOfficialUrl(match.answerTranslation.officialSourceUrl)
        ? match.answerTranslation.officialSourceUrl
        : undefined;
    const matchingOfficialSource = officialTranslationUrl
      ? officialSources.find(
          (source) => safeHost(source.url) === safeHost(officialTranslationUrl),
        )
      : undefined;

    if (
      locale &&
      match.answerTranslation.locale === locale &&
      reviewerApproved
    ) {
      const translationStatus = officialTranslationUrl
        ? 'official_translation'
        : 'human_reviewed';
      const directCitation = officialTranslationUrl
        ? [
            {
              title: match.answerTranslation.title,
              authority:
                matchingOfficialSource?.authority ||
                new URL(officialTranslationUrl).hostname,
              url: officialTranslationUrl,
              jurisdiction,
              ...(matchingOfficialSource?.lastVerified
                ? {
                    lastVerified:
                      matchingOfficialSource.lastVerified.toISOString(),
                  }
                : {}),
            },
            ...citations.filter((citation) => citation.phone === '15100'),
          ]
        : citations;

      return {
        answer: appendEmergencyNotice(
          appendLocalizedHelpline(
            formatApprovedTranslation(match.answerTranslation),
            locale,
          ),
          locale,
          isEmergency,
        ),
        citations: withEmergencyCitation(directCitation, isEmergency),
        jurisdiction,
        lastVerified: latestVerifiedDate(directCitation),
        sourceLanguage: locale,
        translationStatus,
        isTranslationFallback: false,
        isEmergency,
        suggestedActions: [],
      };
    }

    const sourceText = formatApprovedTranslation(match.sourceTranslation);
    const sourceDocuments: GroundingSource[] = ranked.map((candidate) => ({
      title: candidate.sourceTranslation.title,
      summary: candidate.sourceTranslation.summary,
      body: candidate.sourceTranslation.body,
      reference: candidate.content.sourceReference || 'Approved legal content',
    }));

    if (!locale) {
      return {
        answer: appendEmergencyNotice(FALLBACK_NOTICES.en, 'en', isEmergency),
        sourceText,
        citations: withEmergencyCitation(citations, isEmergency),
        jurisdiction,
        lastVerified,
        sourceLanguage: match.sourceTranslation.locale,
        translationStatus: 'translation_unavailable',
        isTranslationFallback: true,
        isEmergency,
        suggestedActions: [],
      };
    }


    try {
      let englishAnswer = appendEnglishUrgentHelpline(
        await this.languageModel.generateGroundedAnswer(
          searchMessage,
          sourceDocuments,
        ),
      );
      if (isEmergency) {
        englishAnswer = `${EMERGENCY_NOTICES.en}\n\n${englishAnswer}`;
      }

      const translatedAnswer = await this.languageModel.translateAnswer(
        englishAnswer,
        locale,
      );

      if (
        translatedAnswer.trim().toLocaleLowerCase() ===
          englishAnswer.trim().toLocaleLowerCase() ||
        !preservesProtectedTokens(englishAnswer, translatedAnswer)
      ) {
        throw new Error(
          'Translation was unchanged or altered a protected legal number, URL, or symbol.',
        );
      }

      return {
        answer: appendEmergencyNotice(translatedAnswer, locale, isEmergency),
        citations: withEmergencyCitation(citations, isEmergency),
        jurisdiction,
        lastVerified,
        sourceLanguage: 'en',
        translationStatus: 'machine_translated',
        isTranslationFallback: false,
        isEmergency,
        suggestedActions: [],
      };
    } catch (error) {
      this.logger.warn(
        `Grounded answer generation or translation failed: ${errorMessage(error)}`,
      );
      return {
        answer: appendEmergencyNotice(
          FALLBACK_NOTICES[locale || 'en'],
          locale || 'en',
          isEmergency,
        ),
        sourceText,
        citations: withEmergencyCitation(citations, isEmergency),
        jurisdiction,
        lastVerified,
        sourceLanguage: match.sourceTranslation.locale,
        translationStatus: 'translation_unavailable',
        isTranslationFallback: true,
        isEmergency,
        suggestedActions: [],
      };
    }
  }

  async saveFeedback(dto: ChatFeedbackDto) {
    return this.prisma.chatFeedback.create({
      data: {
        sessionId: dto.sessionId,
        rating: dto.rating,
        feedbackText: dto.feedbackText,
      },
    });
  }

  private buildCitations(
    match: MatchedContent,
    officialSources: Array<{
      authority: string;
      url: string;
      lastVerified: Date | null;
    }>,
  ): Citation[] {
    const reference = (match.content.sourceReference || '').toLowerCase();
    const trustedSources = officialSources.filter((source) =>
      isTrustedOfficialUrl(source.url),
    );
    const matches = trustedSources.filter((source) => {
      const host = safeHost(source.url);
      const authorityTokens = source.authority
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 3);
      return (
        reference.includes(host) ||
        authorityTokens.some((token) => reference.includes(token))
      );
    });

    const citations: Citation[] = matches.map((source) => ({
      title: match.answerTranslation.title,
      authority: source.authority,
      url: source.url,
      jurisdiction: match.content.jurisdiction || 'IN',
      ...(source.lastVerified
        ? { lastVerified: source.lastVerified.toISOString() }
        : {}),
    }));

    const referenceUrl = extractTrustedReferenceUrl(reference);
    if (
      referenceUrl &&
      !citations.some((citation) => citation.url === referenceUrl)
    ) {
      citations.push({
        title: match.answerTranslation.title,
        authority: new URL(referenceUrl).hostname,
        url: referenceUrl,
        jurisdiction: match.content.jurisdiction || 'IN',
      });
    }

    const nalsa = trustedSources.find((source) =>
      source.authority.toLowerCase().includes('nalsa'),
    );
    if (
      nalsa &&
      !citations.some(
        (citation) =>
          citation.url && safeHost(citation.url) === safeHost(nalsa.url),
      )
    ) {
      citations.push({
        title: 'National Legal Aid Helpline',
        authority: nalsa.authority,
        url: nalsa.url,
        phone: '15100',
        jurisdiction: match.content.jurisdiction || 'IN',
        ...(nalsa.lastVerified
          ? { lastVerified: nalsa.lastVerified.toISOString() }
          : {}),
      });
    }

    return citations;
  }

  private unmatchedResponse(
    locale: SupportedChatLocale | undefined,
    requestedLocale: string,
    officialSources: Array<{
      authority: string;
      url: string;
      lastVerified: Date | null;
    }>,
    isEmergency: boolean,
    legalAidCitations: Citation[],
  ): ChatQueryResponse {
    const nalsa = officialSources.find(
      (source) =>
        source.authority.toLowerCase().includes('nalsa') &&
        isTrustedOfficialUrl(source.url),
    );
    const citations: Citation[] = nalsa
      ? [
          {
            title: 'National Legal Aid Helpline',
            authority: nalsa.authority,
            url: nalsa.url,
            phone: '15100',
            jurisdiction: 'IN',
            ...(nalsa.lastVerified
              ? { lastVerified: nalsa.lastVerified.toISOString() }
              : {}),
          },
        ]
      : [];
    const responseCitations = withEmergencyCitation(
      [...citations, ...legalAidCitations],
      isEmergency,
    );

    const answer =
      requestedLocale !== locale
        ? FALLBACK_NOTICES.en
        : FALLBACK_NOTICES[locale || 'en'];

    return {
      answer: appendEmergencyNotice(answer, locale || 'en', isEmergency),
      citations: responseCitations,
      jurisdiction: 'IN',
      lastVerified: latestVerifiedDate(responseCitations),
      sourceLanguage: 'en',
      translationStatus: 'translation_unavailable',
      isTranslationFallback: locale !== 'en',
      isEmergency,
      suggestedActions: [],
    };
  }
}

function isSupportedLocale(value: string): value is SupportedChatLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedChatLocale);
}

function tokenize(value: string): string[] {
  return [
    ...new Set(
      value
        .toLocaleLowerCase()
        .match(/[\p{L}\p{N}]{2,}/gu)
        ?.filter(
          (term) =>
            !['the', 'and', 'for', 'with', 'what', 'how'].includes(term),
        ) || [],
    ),
  ];
}

function formatApprovedTranslation(translation: {
  title: string;
  summary: string;
  body: string;
}): string {
  return `**${translation.title}**\n\n${translation.summary}\n\n${translation.body.slice(0, 2000)}`;
}

function safeHost(value: string): string {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function extractTrustedReferenceUrl(reference: string): string | undefined {
  const domain = reference.match(
    /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:gov\.in|nic\.in)\b/,
  )?.[0];
  if (!domain) {
    return undefined;
  }
  const url = `https://${domain}`;
  return isTrustedOfficialUrl(url) ? url : undefined;
}

function latestVerifiedDate(citations: Citation[]): string | undefined {
  return citations
    .map((citation) => citation.lastVerified)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
}

export function preservesProtectedTokens(
  source: string,
  translation: string,
): boolean {
  const required =
    source.match(/https?:\/\/\S+|[\d][\d,]*(?:\.\d+)?|[%&]/g) || [];
  const available = [
    ...(translation.match(/https?:\/\/\S+|[\d][\d,]*(?:\.\d+)?|[%&]/g) || []),
  ];

  return required.every((token) => {
    const index = available.indexOf(token);
    if (index < 0) {
      return false;
    }
    available.splice(index, 1);
    return true;
  });
}

function isEmergencyQuestion(message: string): boolean {
  return /\b(emergency|urgent|danger|domestic violence|abuse|threat|attack|beaten)\b|आपात|तत्काल|खतरा|घरेलू हिंसा|मारपीट|धमकी|हमला|ತುರ್ತು|ಅಪಾಯ|ಹಿಂಸೆ|ಬೆದರಿಕೆ|ಹಲ್ಲೆ|அவசர|ஆபத்து|வன்முறை|அச்சுறுத்தல்|தாக்குதல்|అత్యవసర|ప్రమాదం|హింస|బెదిరింపు|దాడి|आपत्कालीन|धोका|हिंसा|धमकी|हल्ला/i.test(
    message,
  );
}

function isLegalAidQuestion(message: string): boolean {
  return /legal aid|free lawyer|free legal|cannot afford|nalsa|dlsa|निःशुल्क कानूनी सहायता|मुफ़्त कानूनी सहायता|वकील|नालसा|ಉಚಿತ ಕಾನೂನು ನೆರವು|ನಲ್ಸಾ|விலையில்லா சட்ட உதவி|இலவச சட்ட உதவி|வழக்கறிஞர்|நல்சா|ఉచిత న్యాయ సహాయం|న్యాయవాది|నల్సా|मोफत कायदेशीर मदत|वकील|नालसा/i.test(
    message,
  );
}

function appendEmergencyNotice(
  answer: string,
  locale: SupportedChatLocale,
  isEmergency: boolean,
): string {
  if (!isEmergency || answer.includes(EMERGENCY_NOTICES[locale])) {
    return answer;
  }
  return `${EMERGENCY_NOTICES[locale]}\n\n${answer}`;
}

function withEmergencyCitation(
  citations: Citation[],
  isEmergency: boolean,
): Citation[] {
  if (
    !isEmergency ||
    citations.some((citation) => citation.url === 'https://112.gov.in')
  ) {
    return citations;
  }
  return [
    ...citations,
    {
      title: 'Emergency response service',
      authority: 'Government of India',
      url: 'https://112.gov.in',
      jurisdiction: 'IN',
    },
  ];
}

function appendLocalizedHelpline(
  answer: string,
  locale: SupportedChatLocale,
): string {
  const sentence = HELPLINE_SENTENCES[locale];
  return answer.includes(sentence) ? answer : `${answer}\n\n${sentence}`;
}

function appendEnglishUrgentHelpline(answer: string): string {
  const sentence =
    'If your matter is urgent, please call the National Legal Aid Helpline directly at 15100 (toll-free 24x7).';
  return answer.includes(sentence) ? answer : `${answer}\n\n${sentence}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown local model error';
}
