'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  ctaText: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  className?: string;
}

export function QuickActionCard({
  title,
  description,
  ctaText,
  href,
  icon,
  badge,
  className,
}: QuickActionCardProps) {
  return (
    <Link href={href} className="block group h-full">
      <Card
        variant="interactive"
        className={cn(
          'h-full flex flex-col justify-between p-6 bg-surface border border-border group-hover:border-accent/40 transition-all duration-200',
          className,
        )}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border group-hover:border-accent/40 flex items-center justify-center text-accent transition-all duration-300 group-hover:scale-105">
              {icon}
            </div>
            {badge && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                {badge}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-text-primary tracking-tight group-hover:text-accent transition-colors">
            {title}
          </h3>

          <p className="text-xs text-text-sub mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-accent">
          <span>{ctaText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}
