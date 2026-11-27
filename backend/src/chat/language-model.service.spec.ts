import { ConfigService } from '@nestjs/config';
import { LanguageModelService } from './language-model.service';

function createConfig(values: Record<string, string | number>) {
  return {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
}

function geminiResponse(answer: string): Response {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      candidates: [
        {
          content: {
            parts: [{ text: JSON.stringify({ answer }) }],
          },
        },
      ],
    }),
  } as Response;
}

describe('LanguageModelService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requires a server-side API key before making a request', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    const model = new LanguageModelService(createConfig({}));

    await expect(model.translateAnswer('Approved answer', 'hi')).rejects.toThrow(
      'GEMINI_API_KEY is not configured',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a grounded prompt to Gemini with the API key in a header only', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(geminiResponse('A grounded answer.'));
    const model = new LanguageModelService(
      createConfig({
        GEMINI_API_KEY: 'server-secret-key',
      }),
    );

    await expect(
      model.generateGroundedAnswer('Question', [
        {
          title: 'Approved topic',
          summary: 'Verified summary',
          body: 'Verified legal text',
          reference: 'India Code',
        },
      ]),
    ).resolves.toBe('A grounded answer.');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-goog-api-key': 'server-secret-key',
        }),
        body: expect.stringContaining('Verified legal text'),
      }),
    );
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).not.toContain('server-secret-key');
    expect(options?.body).not.toContain('server-secret-key');
    expect(JSON.parse(options?.body as string)).toMatchObject({
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2048,
      },
    });
  });

  it('falls back to other free-tier Gemini models when one hits 429', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
      } as Response)
      .mockResolvedValueOnce(geminiResponse('अनुवादित उत्तर'));

    const model = new LanguageModelService(
      createConfig({
        GEMINI_API_KEY: 'server-secret-key',
        GEMINI_RETRY_DELAY_MS: 0,
      }),
    );

    await expect(
      model.translateAnswer('approved answer', 'hi'),
    ).resolves.toBe('अनुवादित उत्तर');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain('gemini-3.6-flash');
    expect(fetchMock.mock.calls[1][0]).toContain('gemini-3.5-flash-lite');
  });

  it('reports free-tier quota exhaustion when all free-tier models return 429', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);
    const model = new LanguageModelService(
      createConfig({
        GEMINI_API_KEY: 'server-secret-key',
        GEMINI_RETRY_DELAY_MS: 0,
      }),
    );

    await expect(
      model.translateAnswer('approved answer', 'hi'),
    ).rejects.toThrow('free-tier quota or rate limit was reached');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(
      fetchMock.mock.calls.every(([url]) =>
        String(url).startsWith('https://generativelanguage.googleapis.com/'),
      ),
    ).toBe(true);
  });

  it('reports provider errors and bounds request time', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);
    const model = new LanguageModelService(
      createConfig({
        GEMINI_API_KEY: 'server-secret-key',
        GEMINI_API_TIMEOUT_MS: 12_000,
        GEMINI_RETRY_DELAY_MS: 0,
      }),
    );

    await expect(
      model.translateAnswer('approved answer', 'hi'),
    ).rejects.toThrow('returned HTTP 503');
    expect(fetchMock.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it('caches identical prompts to conserve free-tier quota', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(geminiResponse('Cached answer'));
    const model = new LanguageModelService(
      createConfig({
        GEMINI_API_KEY: 'server-secret-key',
        GEMINI_RETRY_DELAY_MS: 0,
      }),
    );

    await expect(model.translateAnswer('hello', 'hi')).resolves.toBe(
      'Cached answer',
    );
    await expect(model.translateAnswer('hello', 'hi')).resolves.toBe(
      'Cached answer',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed model responses', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"answer":""}' }] } }],
      }),
    } as Response);
    const model = new LanguageModelService(
      createConfig({
        GEMINI_API_KEY: 'server-secret-key',
        GEMINI_RETRY_DELAY_MS: 0,
      }),
    );

    await expect(
      model.translateAnswer('approved answer', 'hi'),
    ).rejects.toThrow('returned an empty answer');
  });
});
