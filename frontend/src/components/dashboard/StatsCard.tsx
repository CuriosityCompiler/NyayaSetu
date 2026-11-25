'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    positive?: boolean;
    text: string;
  };
  className?: string;
}

export function StatsCard({
  label,
  value,
  subValue,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('flex flex-col justify-between p-5', className)}>
      <div className="flex items-center justify-between text-text-sub">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold text-text-primary tracking-tight">{value}</div>
        {(subValue || trend) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs text-text-sub">
            {trend && (
              <span
                className={cn(
                  'font-medium',
                  trend.positive ? 'text-accent' : 'text-status-warning',
                )}
              >
                {trend.text}
              </span>
            )}
            {subValue && <span>{subValue}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
