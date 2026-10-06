'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'gradient';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon,
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    neutral: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-full',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
