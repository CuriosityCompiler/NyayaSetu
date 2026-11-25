'use client';

import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { Button } from './Button';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  showTags?: boolean;
}

export function SearchBar({ initialQuery = '', className, showTags = true }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const { t } = useI18n();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  const tags = [
    { label: t('search.tag.rti'), query: 'RTI Application' },
    { label: t('search.tag.aid'), query: 'Free Legal Aid' },
    { label: t('search.tag.consumer'), query: 'Consumer Court' },
    { label: t('search.tag.women'), query: 'Domestic Violence' },
    { label: t('search.tag.senior'), query: 'Senior Citizen Maintenance' },
  ];

  return (
    <div className={`w-full max-w-3xl flex flex-col space-y-3 ${className || ''}`}>
      <form
        onSubmit={handleSearch}
        className="relative flex items-center bg-surface border border-border rounded-xl p-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all duration-200"
      >
        <Search className="w-5 h-5 text-accent ml-3 mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-sub/60 focus:outline-none pr-3 py-2"
        />
        <Button
          type="submit"
          size="md"
          variant="primary"
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          className="shrink-0"
        >
          {t('search.button')}
        </Button>
      </form>

      {showTags && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-text-sub">
          <span className="font-medium text-text-sub/70">{t('search.tags.label')}</span>
          {tags.map((tag) => (
            <button
              key={tag.query}
              type="button"
              onClick={() => handleTagClick(tag.query)}
              className="bg-surface-elevated/70 hover:bg-surface-hover hover:text-accent border border-border/80 px-2.5 py-1 rounded-md transition-colors duration-150"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
