'use client'

import React from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-lighter text-slate-200 border border-accent/20',
  success: 'bg-green-500/10 text-green-400 border border-green-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
  accent: 'bg-accent/10 text-accent border border-accent/30',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        transition-all duration-300
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
