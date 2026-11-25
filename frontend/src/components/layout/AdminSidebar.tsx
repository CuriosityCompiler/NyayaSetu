'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck,
  BookOpen,
  MapPin,
  ShieldAlert,
  Users,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: '/admin',
      label: 'Overview & Metrics',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      href: '/admin/review-queue',
      label: 'Editorial Review Queue',
      icon: FileCheck,
      badge: 'Pending',
    },
    {
      href: '/rights',
      label: 'Published Rights Library',
      icon: BookOpen,
    },
    {
      href: '/legal-aid',
      label: 'Legal Aid Directory',
      icon: MapPin,
    },
    {
      href: '/sources',
      label: 'Official Source Audit',
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-sub px-3">
            Governance Console
          </span>
          <div className="mt-2 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-surface-elevated text-accent border border-border'
                      : 'text-text-sub hover:text-text-primary hover:bg-surface-elevated/50',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-accent' : 'text-text-sub')} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[9px] bg-accent/10 text-accent font-semibold px-1.5 py-0.5 rounded">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-sub px-3">
            Statutory Links
          </span>
          <div className="mt-2 space-y-1 text-xs text-text-sub">
            <a
              href="https://nalsa.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-elevated hover:text-accent transition-colors"
            >
              <span>NALSA Management</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://indiacode.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-elevated hover:text-accent transition-colors"
            >
              <span>India Code Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="p-3 bg-surface-elevated rounded-xl border border-border text-xs text-text-sub">
        <div className="flex items-center gap-2 text-text-primary font-medium mb-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span>NALSA Helpline Active</span>
        </div>
        <p className="text-[11px] leading-tight text-text-sub/80">
          Toll-Free 15100 operational 24x7 across all 36 States & UTs.
        </p>
      </div>
    </aside>
  );
}
