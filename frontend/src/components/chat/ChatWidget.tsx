'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Phone,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import api from '@/lib/api';
import { getChatErrorTranslationKey } from '@/lib/chat-error';
import { ChatMessage, Citation, TranslationStatus } from './ChatMessage';
import { Button } from '../ui/Button';

interface Message {
  id: string;
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
  timestamp: string;
}

export function ChatWidget() {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: '',
      citations: [
        {
          title: 'National Legal Aid Helpline',
          authority: 'NALSA',
          phone: '15100',
          url: 'https://nalsa.gov.in',
        },
      ],
      suggestedActions: [],
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === 'initial'
          ? {
              ...message,
              content: t('chat.welcome'),
              suggestedActions: [
                t('chat.actionAid'),
                t('chat.actionRti'),
                t('chat.actionConsumer'),
                t('chat.actionSafety'),
              ],
            }
          : message,
      ),
    );
  }, [locale]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!hasAcceptedPrivacy || !text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post(
        '/chat/query',
        {
          message: text,
          locale,
        },
        { timeout: 210_000 },
      );

      const data = res.data;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || t('chat.thanks'),
        citations: data.citations || [],
        isEmergency: data.isEmergency || false,
        isTranslationFallback: data.isTranslationFallback || false,
        translationStatus: data.translationStatus,
        sourceText: data.sourceText,
        sourceLanguage: data.sourceLanguage,
        jurisdiction: data.jurisdiction,
        lastVerified: data.lastVerified,
        suggestedActions: data.suggestedActions || [],
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${t(getChatErrorTranslationKey(error))} ${t('chat.urgentHelpline')}`,
        citations: [
          {
            title: 'NALSA 24x7 Helpline',
            phone: '15100',
            authority: 'National Legal Services Authority',
          },
        ],
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    handleSend(action);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-accent text-text-inverse font-bold text-xs rounded-full shadow-lg hover:bg-accent-muted hover:shadow-xl active:scale-95 transition-all duration-200 border border-accent/20"
          aria-label={t('chat.openLabel')}
        >
          <Bot className="w-5 h-5" />
          <span>{t('chat.open')}</span>
          <span className="w-2 h-2 rounded-full bg-white/80" />
        </button>
      )}

      {/* Slide-up Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[420px] h-[580px] bg-surface border border-border rounded-2xl shadow-panel flex flex-col overflow-hidden animate-slide-up backdrop-blur-xl">
          {/* Header */}
          <div className="bg-surface-elevated px-4 py-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-text-primary">
                    NyayaMitra
                  </span>
                  <span className="text-[9px] bg-accent/20 text-accent font-semibold px-1.5 py-0.2 rounded">
                    {t('chat.verifiedAi')}
                  </span>
                </div>
                <span className="text-[10px] text-text-sub">
                  {t('chat.grounded')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href="tel:15100"
                className="p-1.5 rounded-lg text-text-sub hover:text-accent hover:bg-surface text-[10px] flex items-center gap-1"
                title={t('chat.call')}
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">15100</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-text-sub hover:text-text-primary hover:bg-surface transition-colors"
                aria-label={t('chat.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                citations={m.citations}
                isEmergency={m.isEmergency}
                isTranslationFallback={m.isTranslationFallback}
                translationStatus={m.translationStatus}
                sourceText={m.sourceText}
                sourceLanguage={m.sourceLanguage}
                jurisdiction={m.jurisdiction}
                lastVerified={m.lastVerified}
                suggestedActions={m.suggestedActions}
                timestamp={m.timestamp}
                onActionClick={hasAcceptedPrivacy ? handleActionClick : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-text-sub py-2 px-3 bg-surface-elevated/40 rounded-xl w-fit">
                <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" />
                <span>{t('chat.searching')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-surface-elevated/80 border-t border-border">
            <div
              role="note"
              className="mb-2 rounded-lg border border-status-warning/40 bg-status-warning/10 px-2.5 py-2 text-[10px] leading-relaxed text-text-primary"
            >
              <p>{t('chat.privacy.notice')}</p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <a
                  href="https://ai.google.dev/gemini-api/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 underline underline-offset-2"
                >
                  {t('chat.privacy.learnMore')}
                </a>
                {hasAcceptedPrivacy ? (
                  <span className="text-text-sub">
                    {t('chat.privacy.accepted')}
                  </span>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setHasAcceptedPrivacy(true)}
                    className="h-7 px-2 text-[10px]"
                  >
                    {t('chat.privacy.accept')}
                  </Button>
                )}
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2 bg-surface rounded-xl border border-border focus-within:border-accent p-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                disabled={!hasAcceptedPrivacy}
                className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-sub/50 px-2.5 py-1.5 focus:outline-none"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!hasAcceptedPrivacy || !input.trim() || isLoading}
                className="rounded-lg h-8 px-2.5"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-text-sub/70 px-1 pt-1.5">
              <span>{t('chat.disclaimer')}</span>
              <a href="tel:15100" className="hover:text-accent font-medium">
                {t('chat.call')}: 15100
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
