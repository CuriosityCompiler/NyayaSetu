'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useI18n } from '@/lib/i18n';

export interface TopicItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  sourceReference?: string;
  jurisdiction?: string;
  isTranslationFallback?: boolean;
}

export function TopicCard({ topic }: { topic: TopicItem }) {
  const { t } = useI18n();

  return (
    <Card variant="interactive" className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="default" size="sm">
            {topic.category}
          </Badge>
          <span className="text-[11px] font-mono text-text-sub px-2 py-0.5 rounded bg-surface-elevated border border-border">
            {topic.jurisdiction || 'Central / IN'}
          </span>
        </div>

        <Link href={`/rights/${topic.slug}`}>
          <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug">
            {topic.title}
          </h3>
        </Link>

        <p className="text-xs text-text-sub mt-2.5 line-clamp-3 leading-relaxed">
          {topic.summary}
        </p>
        {topic.isTranslationFallback && (
          <p className="mt-2 text-[11px] text-text-sub">{t('guide.translationFallback')}</p>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-text-sub text-[11px] truncate max-w-[200px]">
          <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="truncate">{topic.sourceReference || 'Statutory Source Verified'}</span>
        </div>

        <Link
          href={`/rights/${topic.slug}`}
          className="inline-flex items-center gap-1 text-accent font-semibold group-hover:translate-x-1 transition-transform"
        >
          <span>{t('common.readGuide')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
