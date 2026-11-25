'use client';

import React from 'react';
import {
  User,
  Bot,
  AlertTriangle,
  ExternalLink,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export interface Citation {
  title: string;
  authority?: string;
  url?: string;
  phone?: string;
  address?: string;
  jurisdiction?: string;
  lastVerified?: string;
}

export type TranslationStatus =
  | 'human_reviewed'
  | 'official_translation'
  | 'machine_translated'
  | 'translation_unavailable';

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  isEmergency?: boolean;
  isTranslationFallback?: boolean;
  translationStatus?: TranslationStatus;
  sourceText?: string;
  sourceLanguage?: string;
  jurisdiction?: string;
  lastVerified?: string;
  suggestedActions?: string[];
  timestamp?: string;
  onActionClick?: (action: string) => void;
}

export function ChatMessage({
  role,
  content,
  citations = [],
  isEmergency = false,
  isTranslationFallback = false,
  translationStatus,
  sourceText,
  sourceLanguage,
  jurisdiction,
  lastVerified,
  suggestedActions = [],
  timestamp,
  onActionClick,
}: ChatMessageProps) {
  const isUser = role === 'user';
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'flex w-full gap-3 py-3 animate-fade-in',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 text-accent">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={cn(
          'flex flex-col max-w-[85%] space-y-2',
          isUser && 'items-end',
        )}
      >
        {!isUser && translationStatus && (
          <p className="text-[10px] text-text-sub">
            {t(`chat.translation.${translationStatus}`)}
          </p>
        )}
        {!isUser && (sourceLanguage || jurisdiction || lastVerified) && (
          <p className="text-[10px] text-text-sub">
            {sourceLanguage && `${t('chat.sourceLanguage')}: ${sourceLanguage}`}
            {sourceLanguage && jurisdiction && ' · '}
            {jurisdiction && `${t('chat.jurisdiction')}: ${jurisdiction}`}
            {lastVerified &&
              ` · ${t('chat.lastVerified')}: ${new Date(lastVerified).toLocaleDateString()}`}
          </p>
        )}
        {!isUser && !translationStatus && isTranslationFallback && (
          <p className="text-[10px] text-text-sub">{t('chat.answerEnglish')}</p>
        )}
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl p-4 text-xs leading-relaxed',
            isUser
              ? 'bg-accent text-text-inverse font-medium rounded-tr-none'
              : 'bg-surface border border-border text-text-primary rounded-tl-none',
            isEmergency &&
              'border-status-danger/60 bg-status-danger/10 text-text-primary',
          )}
        >
          {isEmergency && (
            <div className="flex items-center gap-1.5 text-status-danger font-bold uppercase tracking-wider text-[10px] mb-2">
              <AlertTriangle className="w-3.5 h-3.5" /> {t('message.emergency')}
            </div>
          )}

          <div className="whitespace-pre-wrap">{content}</div>
        </div>

        {/* Citations Box for Assistant */}
        {!isUser && citations.length > 0 && (
          <div className="w-full bg-surface-subtle border border-border rounded-xl p-3 space-y-2 mt-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-text-sub">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />{' '}
              {t('message.sources')}
            </div>
            <div className="space-y-1.5">
              {citations.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px] p-2 bg-surface-elevated/50 rounded-lg border border-border/60"
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="font-semibold text-text-primary truncate">
                      {c.title}
                    </span>
                    {c.authority && (
                      <span className="text-[10px] text-text-sub">
                        {c.authority}
                      </span>
                    )}
                    {c.address && (
                      <span className="text-[10px] text-text-sub">
                        {c.address}
                      </span>
                    )}
                    {c.jurisdiction && (
                      <span className="text-[10px] text-text-sub">
                        {t('chat.jurisdiction')}: {c.jurisdiction}
                      </span>
                    )}
                    {c.lastVerified && (
                      <span className="text-[10px] text-text-sub">
                        {t('chat.lastVerified')}:{' '}
                        {new Date(c.lastVerified).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-bold flex items-center gap-1 hover:bg-accent hover:text-text-inverse transition-colors"
                      >
                        <Phone className="w-2.5 h-2.5" /> {c.phone}
                      </a>
                    )}
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-text-sub hover:text-accent transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isUser && sourceText && (
          <div className="w-full rounded-xl border border-border bg-surface-subtle p-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-text-sub">
              {t('chat.sourceText')}
              {sourceLanguage ? ` (${sourceLanguage})` : ''}
            </p>
            <div className="whitespace-pre-wrap text-[11px] leading-relaxed text-text-sub">
              {sourceText}
            </div>
          </div>
        )}

        {/* Suggested Follow-up Actions */}
        {!isUser && suggestedActions.length > 0 && onActionClick && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {suggestedActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onActionClick(action)}
                className="text-[11px] font-medium bg-surface hover:bg-surface-elevated text-accent border border-accent/20 hover:border-accent px-2.5 py-1 rounded-full transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {timestamp && (
          <span className="text-[9px] text-text-sub px-1">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent text-text-inverse flex items-center justify-center shrink-0 font-bold">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
