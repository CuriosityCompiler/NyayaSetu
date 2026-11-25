import axios from 'axios';

export function getChatErrorTranslationKey(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'chat.connectionError';
  }

  const status = error.response?.status;
  if (status === undefined) {
    return 'chat.connectionError';
  }
  if (status === 429) {
    return 'chat.rateLimit';
  }
  if (status >= 500) {
    return 'chat.serverError';
  }
  return 'chat.connectionError';
}
