'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="w-full bg-surface border-t border-border mt-20">
      {/* ─── Helpline Alert Banner ─────────────────────────────────── */}
      <div className="bg-surface-elevated border-b border-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-primary">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold text-accent">{t('helpline.banner')}</span>
          </div>
          <div className="flex items-center gap-4 text-text-sub">
            <a
              href="tel:15100"
              className="inline-flex items-center gap-1.5 font-bold text-accent hover:underline"
            >
              <Phone className="w-3.5 h-3.5" /> {t('home.call')}
            </a>
            <span>•</span>
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 font-medium hover:text-text-primary"
            >
              {t('assistant.police')} 112
            </a>
            <span>•</span>
            <a
              href="tel:181"
              className="inline-flex items-center gap-1.5 font-medium hover:text-text-primary"
            >
              {t('assistant.women')} 181
            </a>
          </div>
        </div>
      </div>

      {/* ─── Main Columns ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Portal Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-surface-elevated border border-border flex items-center justify-center">
                <Scale className="w-4 h-4 text-accent" />
              </div>
              <span className="font-bold text-text-primary text-base tracking-tight">
                {t('brand.name')}
              </span>
            </div>
            <p className="text-xs text-text-sub leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>{t('footer.verified')}</span>
            </div>
          </div>

          {/* Col 2: Legal Rights Topics */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              {t('footer.rights')}
            </h4>
            <ul className="space-y-2 text-xs text-text-sub">
              <li>
                <Link href="/rights/right-to-information-rti" className="hover:text-accent transition-colors">
                  Right to Information (RTI Act)
                </Link>
              </li>
              <li>
                <Link href="/rights/free-legal-aid-eligibility" className="hover:text-accent transition-colors">
                  NALSA Free Legal Aid Eligibility
                </Link>
              </li>
              <li>
                <Link href="/rights/protection-of-women-domestic-violence" className="hover:text-accent transition-colors">
                  Protection from Domestic Violence
                </Link>
              </li>
              <li>
                <Link href="/rights/consumer-protection-rights" className="hover:text-accent transition-colors">
                  Consumer Protection & E-Daakhil
                </Link>
              </li>
              <li>
                <Link href="/rights/senior-citizens-maintenance-welfare" className="hover:text-accent transition-colors">
                  Senior Citizens Maintenance Act
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Tools & Help */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2 text-xs text-text-sub">
              <li>
                <Link href="/legal-aid" className="hover:text-accent transition-colors">
                  Find District Legal Services (DLSA)
                </Link>
              </li>
              <li>
                <Link href="/how-to" className="hover:text-accent transition-colors">
                  Step-by-Step Filing Procedures
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-accent transition-colors">
                  NyayaMitra Guided Chatbot
                </Link>
              </li>
              <li>
                <Link href="/sources" className="hover:text-accent transition-colors">
                  Source Verification Policy
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-accent transition-colors">
                  Search All Legal Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Portals */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              {t('footer.portals')}
            </h4>
            <ul className="space-y-2 text-xs text-text-sub">
              <li>
                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                >
                  NALSA Portal <ExternalLink className="w-3 h-3 text-text-sub/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://indiacode.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                >
                  India Code (Central Acts) <ExternalLink className="w-3 h-3 text-text-sub/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://ecourts.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                >
                  e-Courts Services <ExternalLink className="w-3 h-3 text-text-sub/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://karnataka.nalsa.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                >
                  Karnataka SLSA <ExternalLink className="w-3 h-3 text-text-sub/70" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Legal Disclaimer & Copyright ─────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-sub">
          <p className="max-w-2xl leading-relaxed text-[11px] text-text-sub/80 text-center md:text-left">
            {t('disclaimer.banner')}
          </p>
          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <span>© 2026 NyayaSetu Portal</span>
            <span>•</span>
            <Link href="/sources" className="hover:text-text-primary">
              {t('sources.policy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
