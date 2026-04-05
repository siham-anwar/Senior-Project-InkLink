'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-gradient-to-br from-card to-card/50 border-border/50',
    success: 'bg-gradient-to-br from-green-50/50 to-green-50/20 dark:from-green-950/20 dark:to-green-950/5 border-green-200/50 dark:border-green-800/50',
    warning: 'bg-gradient-to-br from-yellow-50/50 to-yellow-50/20 dark:from-yellow-950/20 dark:to-yellow-950/5 border-yellow-200/50 dark:border-yellow-800/50',
    danger: 'bg-gradient-to-br from-red-50/50 to-red-50/20 dark:from-red-950/20 dark:to-red-950/5 border-red-200/50 dark:border-red-800/50',
  };

  const variantIconStyles = {
    default: 'bg-primary/15 text-primary',
    success: 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className={`rounded-xl border p-6 transition-all hover:border-primary/20 ${variantStyles[variant]} ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          <p className="mt-3 text-4xl font-bold text-foreground">{value}</p>

          {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}

          {trend && (
            <div className={`mt-2 text-xs font-bold ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </div>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <div className={`rounded-xl p-3 ${variantIconStyles[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
