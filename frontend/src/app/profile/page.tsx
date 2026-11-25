'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Globe,
  Trash2,
  CheckCircle2,
  Shield,
  Bookmark,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n, LANGUAGES, SupportedLocale } from '@/lib/i18n';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function ProfilePage() {
  const { user, logout, checkAuth } = useAuth();
  const { locale, setLocale } = useI18n();
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleUpdateLocale = async (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    try {
      await api.patch('/users/me/preferences', { locale: newLocale });
      setSuccessMessage('Language preference updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Ignored if offline
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/users/me');
      await logout();
      router.push('/');
    } catch {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User className="w-12 h-12 text-text-sub mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-primary">Profile Unavailable</h2>
        <p className="text-xs text-text-sub mt-1">This page is available to signed-in account holders.</p>
        <Button onClick={() => router.push('/')} size="sm" variant="primary" className="mt-4">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent text-text-inverse font-bold text-lg flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">{user.name}</h1>
              <Badge variant="default" size="sm">{user.role}</Badge>
            </div>
            <p className="text-xs text-text-sub">{user.email}</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left col: Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Language Preference Card */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-accent" /> Preferred Portal Language
            </h3>
            <p className="text-xs text-text-sub mb-4">
              Select your preferred language. All guides, assistant queries, and directory entries will adapt accordingly.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleUpdateLocale(lang.code)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                    locale === lang.code
                      ? 'bg-accent/10 border-accent text-accent font-semibold'
                      : 'bg-surface border-border text-text-sub hover:text-text-primary hover:bg-surface-elevated'
                  }`}
                >
                  <span className="block font-bold text-sm text-text-primary">{lang.nativeName}</span>
                  <span className="text-[10px] text-text-sub">{lang.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Privacy & Rights Data Minimization */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-accent" /> Privacy & Data Minimization
            </h3>
            <p className="text-xs text-text-sub leading-relaxed">
              NyayaSetu practices strict data minimization under the Digital Personal Data Protection (DPDP) Act, 2023. We do not store transcripts of your confidential queries without explicit consent.
            </p>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-status-danger font-medium">Erase Account and Stored Preferences</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Right col: Account summary */}
        <div className="space-y-6">
          <Card className="p-5">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-2">
              Quick Shortcuts
            </span>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => router.push('/rights')}
                className="w-full text-left p-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-text-primary flex items-center justify-between"
              >
                <span>Browse Rights Library</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-sub" />
              </button>
              <button
                onClick={() => router.push('/legal-aid')}
                className="w-full text-left p-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-text-primary flex items-center justify-between"
              >
                <span>Find Free Legal Aid</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-sub" />
              </button>
              <button
                onClick={() => router.push('/assistant')}
                className="w-full text-left p-2.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-text-primary flex items-center justify-between"
              >
                <span>Chat with NyayaMitra</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-sub" />
              </button>
            </div>
          </Card>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs text-text-sub">
            <span className="font-semibold text-text-primary block mb-1">National Helpline:</span>
            <p className="text-[11px] leading-relaxed">
              Dial <span className="text-accent font-bold">15100</span> anytime for 24x7 telephone assistance from NALSA counsel.
            </p>
          </div>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Account Erasure"
        description="This will permanently delete your user profile and all preferences. This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-sub leading-relaxed">
            Pursuant to the Right to Erasure, all associated records will be removed from the database immediately.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={loading}
              onClick={handleDeleteAccount}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
