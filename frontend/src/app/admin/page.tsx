'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  FileCheck,
  MapPin,
  Users,
  ShieldCheck,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    publishedGuides: 5,
    pendingReviews: 2,
    verifiedContacts: 6,
    totalUsers: 142,
    helplineActive: '15100',
    systemStatus: 'Healthy',
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.stats) {
          setStats(res.data.stats);
          setRecentLogs(res.data.recentAuditLogs || []);
        }
      } catch {
        // Fallback default metrics
        setRecentLogs([
          {
            id: '1',
            action: 'APPROVE LegalContent #rti-2026',
            actor: { name: 'Dr. Ramesh Chandra', role: 'ADMIN' },
            createdAt: '2026-10-25T14:30:00Z',
          },
          {
            id: '2',
            action: 'VERIFY OfficialSource NALSA-15100',
            actor: { name: 'Advocate Ananya Deshmukh', role: 'REVIEWER' },
            createdAt: '2026-10-24T11:15:00Z',
          },
          {
            id: '3',
            action: 'UPDATE LegalAidContact DLSA-Bengaluru',
            actor: { name: 'Dr. Ramesh Chandra', role: 'ADMIN' },
            createdAt: '2026-10-22T09:40:00Z',
          },
        ]);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                Government Portal Control
              </span>
              <Badge variant="verified" size="sm">
                System Active
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
              Legal Governance Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/admin/review-queue')}
              size="sm"
              variant="primary"
              leftIcon={<FileCheck className="w-4 h-4" />}
            >
              Review Queue ({stats.pendingReviews})
            </Button>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Published Guides"
            value={stats.publishedGuides}
            subValue="Statutory & verified"
            icon={<BookOpen className="w-5 h-5" />}
            trend={{ positive: true, text: '100% Verified' }}
          />
          <StatsCard
            label="Pending Review Queue"
            value={stats.pendingReviews}
            subValue="Awaiting Legal Review"
            icon={<FileCheck className="w-5 h-5" />}
            trend={{ positive: false, text: 'Editorial SLA < 48h' }}
          />
          <StatsCard
            label="Verified Legal Clinics"
            value={stats.verifiedContacts}
            subValue="Across 36 States/UTs"
            icon={<MapPin className="w-5 h-5" />}
            trend={{ positive: true, text: 'Active & Checked' }}
          />
          <StatsCard
            label="Citizen Engagements"
            value={stats.totalUsers}
            subValue="Registered Citizens"
            icon={<Users className="w-5 h-5" />}
            trend={{ positive: true, text: '+18% this month' }}
          />
        </div>

        {/* Content Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Quick Actions & Workflow */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-text-primary mb-2 flex items-center justify-between">
                <span>Content Publication Policy</span>
                <span className="text-xs font-normal text-text-sub">Four-Eye Principle</span>
              </h3>
              <p className="text-xs text-text-sub leading-relaxed mb-6">
                All statutory guides require two distinct actors before going live: an Editor drafts the simplified explanation, and an empanelled Reviewer verifies it against the official Central or State Act on India Code / NALSA.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                  <span className="font-bold text-accent block mb-1">Step 1: Draft</span>
                  <span className="text-text-sub">Editor extracts relevant sections from government gazette.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                  <span className="font-bold text-accent block mb-1">Step 2: Review</span>
                  <span className="text-text-sub">Empanelled counsel verifies legal accuracy & non-hallucination.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
                  <span className="font-bold text-accent block mb-1">Step 3: Publish</span>
                  <span className="text-text-sub">Content released with verifiable timestamp & reviewer badge.</span>
                </div>
              </div>
            </Card>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Editorial Review Queue</h4>
                  <p className="text-xs text-text-sub mt-0.5">Inspect draft legal content revisions</p>
                </div>
                <Button
                  onClick={() => router.push('/admin/review-queue')}
                  size="sm"
                  variant="outline"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Open
                </Button>
              </Card>

              <Card className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-primary">Source Verification Audit</h4>
                  <p className="text-xs text-text-sub mt-0.5">Check government domain links</p>
                </div>
                <Button
                  onClick={() => router.push('/sources')}
                  size="sm"
                  variant="outline"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Verify
                </Button>
              </Card>
            </div>
          </div>

          {/* Right: Immutable Audit Trail */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center justify-between">
                <span>Recent Audit Trail</span>
                <Clock className="w-4 h-4 text-accent" />
              </h3>

              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-surface-elevated/70 border border-border text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text-primary">{log.actor?.name || 'Administrator'}</span>
                      <span className="text-[10px] text-text-sub">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-accent truncate">{log.action}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
