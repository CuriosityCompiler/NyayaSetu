'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  MapPin,
  FileText,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Scale,
  Users,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { SearchBar } from '@/components/ui/SearchBar';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem] items-end gap-10 lg:gap-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-[-0.04em] max-w-4xl leading-[1.06]">
              {t('hero.title')}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-text-sub max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="mt-7 flex flex-wrap justify-start gap-3">
              <Link
                href="/rights"
                className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-muted active:scale-[0.98]"
              >
                {t('home.exploreRights')}
              </Link>
              <Link
                href="/legal-aid"
                className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-elevated active:scale-[0.98]"
              >
                {t('home.findAid')}
              </Link>
            </div>

            <div className="mt-8 w-full flex justify-start">
              <SearchBar />
            </div>
          </div>

          <aside className="hidden lg:block rounded-2xl border border-border bg-surface p-7 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <PhoneCall className="h-5 w-5" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-text-sub">
              {t('home.needHelp')}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-primary">
              {t('home.freeAidCall')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-sub">
              {t('home.helplineDesc')}
            </p>
            <a
              href="tel:15100"
              className="mt-6 inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-accent hover:text-accent-muted"
            >
              {t('home.call')} <ArrowRight className="h-4 w-4" />
            </a>
            <div className="mt-6 border-t border-border pt-4 text-xs text-text-sub">
              {t('home.freeTollFree')}
            </div>
          </aside>
        </div>

        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="bg-surface border border-border p-5 rounded-xl hover:border-border-hover transition-colors">
            <span className="text-[11px] font-medium text-text-sub uppercase tracking-wider block">
              {t('home.nationalHelpline')}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-accent mt-1 flex items-center gap-1.5">
              <PhoneCall className="w-5 h-5 text-accent" /> 15100
            </div>
            <span className="text-[10px] text-text-sub mt-0.5 block">{t('home.legalAdvice')}</span>
          </div>

          <div className="bg-surface border border-border p-5 rounded-xl hover:border-border-hover transition-colors">
            <span className="text-[11px] font-medium text-text-sub uppercase tracking-wider block">
              {t('home.authorities')}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              {t('home.states')}
            </div>
            <span className="text-[10px] text-text-sub mt-0.5 block">{t('home.nalsa')}</span>
          </div>

          <div className="bg-surface border border-border p-5 rounded-xl hover:border-border-hover transition-colors">
            <span className="text-[11px] font-medium text-text-sub uppercase tracking-wider block">
              {t('home.languageAccess')}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
              {t('home.languages')}
            </div>
            <span className="text-[10px] text-text-sub mt-0.5 block">EN, KN, TA, TE, HI, MR</span>
          </div>

          <div className="bg-surface border border-border p-5 rounded-xl hover:border-border-hover transition-colors">
            <span className="text-[11px] font-medium text-text-sub uppercase tracking-wider block">
              {t('home.citizenCost')}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-accent mt-1">
              {t('home.free')}
            </div>
            <span className="text-[10px] text-text-sub mt-0.5 block">{t('home.act')}</span>
          </div>
        </div>
      </section>

      {/* ─── Four Primary Cards Section ─────────────────────────────── */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              {t('home.gateway')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1">
              {t('home.pathways')}
            </h2>
          </div>
          <p className="text-xs text-text-sub max-w-md">
            {t('home.pathwaysDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuickActionCard
            title={t('card.rights.title')}
            description={t('card.rights.desc')}
            ctaText={t('card.rights.cta')}
            href="/rights"
            icon={<Shield className="w-6 h-6" />}
            badge={t('home.verified')}
          />

          <QuickActionCard
            title={t('card.aid.title')}
            description={t('card.aid.desc')}
            ctaText={t('card.aid.cta')}
            href="/legal-aid"
            icon={<MapPin className="w-6 h-6" />}
            badge={t('home.directory')}
          />

          <QuickActionCard
            title={t('card.howTo.title')}
            description={t('card.howTo.desc')}
            ctaText={t('card.howTo.cta')}
            href="/how-to"
            icon={<FileText className="w-6 h-6" />}
            badge={t('home.stepByStep')}
          />

          <QuickActionCard
            title={t('card.official.title')}
            description={t('card.official.desc')}
            ctaText={t('card.official.cta')}
            href="/sources"
            icon={<Building2 className="w-6 h-6" />}
            badge={t('home.government')}
          />
        </div>
      </section>

      {/* ─── NyayaMitra Assistant Spotlight ─────────────────────────── */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-surface border border-border p-8 sm:p-10 shadow-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('home.groundedAi')}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                {t('assistant.title')}
              </h3>

              <p className="text-sm text-text-sub leading-relaxed max-w-2xl">
                {t('assistant.desc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-text-primary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>{t('assistant.f1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>{t('assistant.f2')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>{t('assistant.f3')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end justify-center">
              <Link href="/assistant">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
                  {t('assistant.cta')}
                </Button>
              </Link>
              <span className="text-[11px] text-text-sub">
                {t('home.createAccount')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Official Sources Hierarchy Showcase ────────────────────── */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-accent uppercase tracking-wider">
            {t('home.contentPolicy')}
          </span>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            {t('home.officialRepositories')}
          </h2>
          <p className="text-xs text-text-sub mt-2">
            {t('home.sourcePolicy')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://nalsa.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Primary Source</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mt-2">NALSA Legal Aid</h4>
            <p className="text-xs text-text-sub mt-1 leading-relaxed">
              Official eligibility criteria, application rules, and 15100 helpline registry.
            </p>
          </a>

          <a
            href="https://indiacode.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Statutory Act</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mt-2">India Code Portal</h4>
            <p className="text-xs text-text-sub mt-1 leading-relaxed">
              Official Central Acts, legislative gazette notifications, and procedural rules.
            </p>
          </a>

          <a
            href="https://karnataka.nalsa.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">State SLSA</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mt-2">Karnataka SLSA</h4>
            <p className="text-xs text-text-sub mt-1 leading-relaxed">
              District and Taluk legal aid clinics, Nyaya Degula contacts, and Lok Adalat schedules.
            </p>
          </a>

          <a
            href="https://ecourts.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-5 rounded-xl bg-surface border border-border hover:border-accent/40 transition-colors"
          >
            <div className="flex items-center justify-between text-text-sub">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Judicial System</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-text-primary mt-2">e-Courts National</h4>
            <p className="text-xs text-text-sub mt-1 leading-relaxed">
              Case status search, court cause lists, and electronic court filing channels.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
