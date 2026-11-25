'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { LanguageSelector } from '../ui/LanguageSelector';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextIsDark);
    setIsDark(nextIsDark);
    try {
      localStorage.setItem('nyaya_theme', nextIsDark ? 'dark' : 'light');
    } catch {
      // Keep the selected theme for this page even when storage is unavailable.
    }
  };

  const themeLabel = isDark
    ? t('theme.switchToLight')
    : t('theme.switchToDark');
  const ThemeIcon = isDark ? Sun : Moon;

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/rights', label: t('nav.rights') },
    { href: '/legal-aid', label: t('nav.legalAid') },
    { href: '/how-to', label: t('nav.howTo') },
    { href: '/sources', label: t('nav.sources') },
    { href: '/assistant', label: t('nav.assistant') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.5rem] flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center transition-colors duration-200 group-hover:bg-accent-muted">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
              {t('brand.name')}
            </span>
            <span className="text-[10px] text-text-sub -mt-1 hidden sm:inline">
              {t('brand.portal')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-sub hover:text-text-primary hover:bg-surface-hover',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSelector />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ThemeIcon className="h-4 w-4" aria-hidden="true" />
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {['ADMIN', 'REVIEWER', 'EDITOR'].includes(user.role) && (
                <Link href="/admin">
                  <Button size="sm" variant="outline" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                    {t('nav.adminDashboard')}
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button size="sm" variant="secondary" leftIcon={<UserIcon className="w-3.5 h-3.5" />}>
                  {user.name.split(' ')[0]}
                </Button>
              </Link>
              <button
                onClick={() => logout()}
                title={t('nav.signOut')}
                className="p-2 rounded-lg text-text-sub hover:text-status-danger hover:bg-surface transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ThemeIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-text-sub hover:text-text-primary hover:bg-surface"
            aria-label={t('nav.toggle')}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-text-primary hover:bg-surface hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface rounded-lg"
                >
                  <UserIcon className="w-4 h-4 text-accent" /> {t('nav.profile')} ({user.name})
                </Link>
                {['ADMIN', 'REVIEWER', 'EDITOR'].includes(user.role) && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface rounded-lg"
                  >
                    <LayoutDashboard className="w-4 h-4 text-accent" /> {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-status-danger hover:bg-surface rounded-lg w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> {t('nav.signOut')}
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
