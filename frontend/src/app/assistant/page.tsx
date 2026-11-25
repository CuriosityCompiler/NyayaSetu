'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Phone,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import api from '@/lib/api';
import { getChatErrorTranslationKey } from '@/lib/chat-error';
import {
  ChatMessage,
  Citation,
  TranslationStatus,
} from '@/components/chat/ChatMessage';
import { Button } from '@/components/ui/Button';

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

export default function AssistantPage() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '',
      citations: [
        {
          title: 'National Legal Aid Scheme',
          authority: 'NALSA',
          phone: '15100',
          url: 'https://nalsa.gov.in',
        },
      ],
      suggestedActions: [],
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === 'welcome'
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
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!hasAcceptedPrivacy || !trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post(
        '/chat/query',
        {
          message: trimmed,
          locale,
        },
        { timeout: 210_000 },
      );

      const data = res.data;
      const botMsg: Message = {
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

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
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
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterQuestions = [
    t('chat.actionAid'),
    t('chat.actionRti'),
    t('chat.actionConsumer'),
    t('chat.actionSafety'),
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* ─── Left Sidebar: Helpful Controls & Hotlines ─────────────── */}
      <div className="lg:w-80 shrink-0 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2 text-text-primary font-bold text-sm">
              <Bot className="w-5 h-5 text-accent" />
              <span>{t('assistant.titlePage')}</span>
            </div>
            <p className="text-xs text-text-sub leading-relaxed">
              {t('assistant.descriptionPage')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <span className="text-[11px] font-bold text-text-sub uppercase tracking-wider block mb-2">
              {t('assistant.commonQuestions')}
            </span>
            <div className="space-y-1.5">
              {starterQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-surface-elevated/60 hover:bg-surface-elevated text-text-primary hover:text-accent border border-border/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Panel */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2 text-xs">
          <span className="font-bold text-text-primary block flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-accent" />{' '}
            {t('assistant.hotlines')}
          </span>
          <div className="space-y-1 text-text-sub text-[11px]">
            <div className="flex justify-between">
              <span>{t('assistant.legalAid')}</span>
              <a href="tel:15100" className="font-bold text-accent">
                15100
              </a>
            </div>
            <div className="flex justify-between">
              <span>{t('assistant.police')}</span>
              <a href="tel:112" className="font-medium text-text-primary">
                112
              </a>
            </div>
            <div className="flex justify-between">
              <span>{t('assistant.women')}</span>
              <a href="tel:181" className="font-medium text-text-primary">
                181
              </a>
            </div>
            <div className="flex justify-between">
              <span>{t('assistant.senior')}</span>
              <a href="tel:14567" className="font-medium text-text-primary">
                14567
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right: Main Chat Console ──────────────────────────────── */}
      <div className="flex-1 bg-surface border border-border rounded-2xl shadow-panel flex flex-col overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
              onActionClick={
                hasAcceptedPrivacy ? (action) => handleSend(action) : undefined
              }
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-text-sub py-2 px-3 bg-surface-elevated rounded-xl w-fit">
              <Sparkles className="w-4 h-4 text-accent animate-spin" />
              <span>{t('assistant.analyzing')}</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Query Input Bar */}
        <div className="p-4 bg-surface-elevated border-t border-border">
          <div
            role="note"
            className="mb-3 rounded-xl border border-status-warning/40 bg-status-warning/10 px-3 py-2.5 text-xs leading-relaxed text-text-primary"
          >
            <p>{t('chat.privacy.notice')}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <a
                href="https://ai.google.dev/gemini-api/terms"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
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
            className="flex items-center gap-2 bg-surface rounded-xl border border-border focus-within:border-accent p-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('assistant.placeholder')}
              disabled={!hasAcceptedPrivacy}
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-sub/50 px-3 py-2 focus:outline-none"
            />
            <Button
              type="submit"
              size="md"
              variant="primary"
              disabled={!hasAcceptedPrivacy || !input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-text-sub pt-2 px-1">
            <span>{t('assistant.disclaimer')}</span>
            <span className="font-semibold text-accent">NALSA: 15100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
