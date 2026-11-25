'use client';

import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useI18n } from '@/lib/i18n';

export interface LegalAidItem {
  id: string;
  authority: string;
  state: string;
  district?: string | null;
  address: string;
  phone: string;
  email?: string | null;
  hours?: string | null;
  sourceUrl?: string | null;
  verificationStatus: string;
}

export function DirectoryCard({ contact }: { contact: LegalAidItem }) {
  const { t } = useI18n();
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${contact.authority}, ${contact.address}`,
  )}`;

  return (
    <Card className="flex flex-col justify-between h-full group hover:border-accent/40 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">
              {contact.state} {contact.district ? `• ${contact.district}` : ''}
            </span>
            <h3 className="text-base font-semibold text-text-primary mt-1 tracking-tight leading-snug">
              {contact.authority}
            </h3>
          </div>
          <Badge variant="verified" size="sm" className="shrink-0">
            <ShieldCheck className="w-3 h-3 mr-1 inline" /> {t('common.verified')}
          </Badge>
        </div>

        <div className="space-y-2.5 mt-3 text-xs text-text-sub">
          <div className="flex items-start gap-2 leading-relaxed">
            <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>{contact.address}</span>
          </div>

          {contact.hours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-sub shrink-0" />
              <span>{contact.hours}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
        <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="shrink-0">
          <Button size="sm" variant="primary" leftIcon={<Phone className="w-3.5 h-3.5" />}>
            {contact.phone}
          </Button>
        </a>

        <div className="flex items-center gap-2">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-sub hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <span>{t('common.directions')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {contact.sourceUrl && (
            <a
              href={contact.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-sub hover:text-accent transition-colors flex items-center gap-1"
            >
              <span>{t('common.source')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
