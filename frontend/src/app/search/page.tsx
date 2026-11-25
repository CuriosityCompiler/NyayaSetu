'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, BookOpen, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';

function SearchResultsContent() {
  const { locale, t } = useI18n();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ rights: any[]; legalAid: any[] }>({
    rights: [],
    legalAid: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function doSearch() {
      if (!initialQuery.trim()) return;
      setLoading(true);
      try {
        const [rightsRes, aidRes] = await Promise.all([
          api.get('/rights', { params: { q: initialQuery, locale } }),
          api.get('/legal-aid', { params: { q: initialQuery } }),
        ]);

        setResults({
          rights: Array.isArray(rightsRes.data) ? rightsRes.data : [],
          legalAid: Array.isArray(aidRes.data) ? aidRes.data : [],
        });
      } catch {
        setResults({
          rights: [
            {
              slug: 'right-to-information-rti',
              title: 'Right to Information (RTI Act 2005)',
              category: 'Transparency',
              summary: 'Request official records from any public authority within 30 days.',
            },
          ],
          legalAid: [
            {
              id: '1',
              authority: 'National Legal Services Authority (NALSA)',
              state: 'Central / National',
              phone: '15100',
              address: 'Supreme Court Complex, New Delhi',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [initialQuery, locale]);

  const totalCount = results.rights.length + results.legalAid.length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
          {t('search.results')} &quot;{initialQuery}&quot;
        </h1>
        <p className="text-xs text-text-sub mt-1">
          {loading ? t('search.loading') : t('search.found').replace('{count}', String(totalCount))}
        </p>
      </div>

      {/* Results List */}
      <div className="space-y-8">
        {/* Legal Rights Matches */}
        <div>
          <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> {t('search.rights')} ({results.rights.length})
          </h2>
          {results.rights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.rights.map((r: any) => (
                <Card key={r.slug || r.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <Badge variant="default" size="sm" className="mb-2">
                      {r.category || 'Statutory Guide'}
                    </Badge>
                    <h3 className="text-base font-semibold text-text-primary">{r.title}</h3>
                    <p className="text-xs text-text-sub mt-2 leading-relaxed line-clamp-2">
                      {r.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <Link
                      href={`/rights/${r.slug}`}
                      className="text-xs font-semibold text-accent inline-flex items-center gap-1 hover:underline"
                    >
                      <span>{t('search.readGuide')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-sub">{t('search.noRights')}</p>
          )}
        </div>

        {/* Legal Aid Directory Matches */}
        <div>
          <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {t('search.aid')} ({results.legalAid.length})
          </h2>
          {results.legalAid.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.legalAid.map((a: any) => (
                <Card key={a.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                      {a.state} {a.district ? `• ${a.district}` : ''}
                    </span>
                    <h3 className="text-base font-semibold text-text-primary mt-1">{a.authority}</h3>
                    <p className="text-xs text-text-sub mt-2">{a.address}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">Phone: {a.phone}</span>
                    <a href={`tel:${a.phone}`} className="text-xs text-accent font-semibold hover:underline">
                      {t('search.callNow')} →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-sub">{t('search.noAid')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-text-sub">Loading search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
