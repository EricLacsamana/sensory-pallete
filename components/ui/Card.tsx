'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  isHovered?: boolean
  onHover?: (hovered: boolean) => void
  clickable?: boolean
}

export function Card({
  children,
  className = '',
  isHovered = false,
  onHover,
  clickable = false,
}: CardProps) {
  return (
    <div
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className={`
        game-card group p-6 rounded-2xl transition-all duration-300 border
        ${clickable ? 'cursor-pointer' : ''}
        ${
          isHovered
            ? 'bg-gradient-to-br from-accent/20 to-secondary/20 border-accent shadow-glow-lg transform scale-105'
            : 'bg-surface-lighter/40 border-accent/20 hover:border-accent/50'
        }
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  trend: string
  icon: React.ReactNode
  gradient: string
  isHovered?: boolean
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  gradient,
  isHovered = false,
}: StatCardProps) {
  return (
    <div
      className={`
        game-card group p-6 rounded-2xl cursor-pointer transition-all duration-300 border
        ${
          isHovered
            ? `${gradient} border-accent shadow-glow-lg transform scale-105`
            : 'bg-surface-lighter/40 border-accent/20 hover:border-accent/50'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted text-sm font-semibold uppercase tracking-widest">
            {label}
          </p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div
          className={`p-3 rounded-xl transition-all ${isHovered ? 'scale-110' : 'scale-100'}`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <p
        className={`text-sm font-semibold ${
          isHovered ? 'text-white' : 'text-accent'
        }`}
      >
        {trend}
      </p>
    </div>
  )
}
