'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Check,
  X,
  ShieldCheck,
  Clock,
  ExternalLink,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ReviewQueuePage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fallbackReviews = [
    {
      id: 'rev-01',
      topic: {
        slug: 'right-to-education-rte',
        category: 'Fundamental Rights',
      },
      jurisdiction: 'IN (Central)',
      sourceReference: 'Right of Children to Free and Compulsory Education Act, 2009 (Act No. 35 of 2009)',
      createdBy: { name: 'Pooja Varma', role: 'EDITOR' },
      createdAt: '2026-10-25T10:15:00Z',
      translations: [
        {
          title: 'Right to Free and Compulsory Education in India (RTE)',
          summary:
            'Every child aged 6 to 14 has a constitutional right to free and compulsory elementary education under Article 21A. Mandates 25% admission quota for disadvantaged groups in private schools.',
          body:
            '1. No child shall be subjected to physical punishment or mental harassment.\n2. No screening procedure for admission or collection of capitation fees.\n3. Grievances can be lodged before State Commission for Protection of Child Rights (SCPCR).',
        },
      ],
    },
    {
      id: 'rev-02',
      topic: {
        slug: 'rights-of-persons-with-disabilities',
        category: 'Social Justice',
      },
      jurisdiction: 'IN (Central)',
      sourceReference: 'Rights of Persons with Disabilities Act, 2016 (RPwD Act) · indiacode.nic.in',
      createdBy: { name: 'Pooja Varma', role: 'EDITOR' },
      createdAt: '2026-10-24T16:00:00Z',
      translations: [
        {
          title: 'Rights of Persons with Disabilities — Reservation & Accessibility',
          summary:
            'Expands recognized disabilities from 7 to 21 types, guarantees 4% job reservation in government establishments and 5% higher education quota, and penalizes discrimination.',
          body:
            'Public buildings, transport, and websites must adhere to mandated accessibility standards. Complaints may be addressed to Chief Commissioner for Persons with Disabilities (CCPD).',
        },
      ],
    },
  ];

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const res = await api.get('/admin/reviews');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data);
        } else {
          setReviews(fallbackReviews);
        }
      } catch {
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await api.post(`/admin/content/${id}/approve`, {
        decision,
        notes: `Decision recorded by legal reviewer on ${new Date().toISOString()}`,
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setActionMessage(`Content revision #${id} successfully ${decision.toLowerCase()}.`);
      setTimeout(() => setActionMessage(''), 4000);
    } catch {
      // In offline/mock mode, update UI locally
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setActionMessage(`Content revision #${id} marked as ${decision.toLowerCase()} (preview mode).`);
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div>
            <Link
              href="/admin"
              className="text-xs text-text-sub hover:text-accent flex items-center gap-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Editorial Review Queue
            </h1>
            <p className="text-xs text-text-sub mt-1">
              Statutory verification gate — verify citations against India Code before approving for citizen view.
            </p>
          </div>
          <Badge variant="verified">Empanelled Reviewer Role</Badge>
        </div>

        {actionMessage && (
          <div className="p-3 bg-accent/10 border border-accent/30 text-accent text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {reviews.map((rev) => {
            const tr = rev.translations?.[0] || {};
            return (
              <Card key={rev.id} className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{rev.topic?.category || 'Legal Guide'}</Badge>
                    <span className="text-xs font-mono text-text-sub">{rev.jurisdiction}</span>
                  </div>
                  <div className="text-xs text-text-sub flex items-center gap-2">
                    <span>Drafted by: <span className="text-text-primary font-medium">{rev.createdBy?.name || 'Editor'}</span></span>
                    <span>•</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary">{tr.title}</h3>
                  <div className="mt-1 text-xs text-accent font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Statutory Reference: {rev.sourceReference}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-elevated/70 border border-border text-xs space-y-2">
                  <span className="font-bold text-text-primary uppercase tracking-wider text-[10px] block">
                    Plain-Language Summary
                  </span>
                  <p className="text-text-sub leading-relaxed">{tr.summary}</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-subtle border border-border text-xs space-y-2">
                  <span className="font-bold text-text-primary uppercase tracking-wider text-[10px] block">
                    Key Provisions Drafted
                  </span>
                  <p className="text-text-sub whitespace-pre-wrap leading-relaxed">{tr.body}</p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDecision(rev.id, 'REJECTED')}
                    leftIcon={<X className="w-3.5 h-3.5" />}
                  >
                    Reject Revision
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleDecision(rev.id, 'APPROVED')}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Approve & Publish Live
                  </Button>
                </div>
              </Card>
            );
          })}

          {reviews.length === 0 && (
            <div className="text-center py-16 bg-surface border border-border rounded-xl p-8">
              <FileCheck className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="text-base font-semibold text-text-primary">Review Queue is Clear</h3>
              <p className="text-xs text-text-sub mt-1">
                All drafted legal guides have been reviewed and published.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
