import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'verified' | 'outline' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-accent/10 text-accent border border-accent/20',
    verified: 'bg-accent/10 text-accent border border-accent/20',
    outline: 'border border-border text-text-sub',
    warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
    danger: 'bg-status-danger/10 text-status-danger border border-status-danger/20',
    info: 'bg-accent/10 text-accent border border-accent/20',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full tracking-wide select-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
