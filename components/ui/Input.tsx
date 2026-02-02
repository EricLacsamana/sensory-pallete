'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    containerClassName = '',
    className = '',
    id,
    type = 'text',
    ...props
  }: InputProps,
  ref: React.Ref<HTMLInputElement>
) {
  const inputId = id || `input-${Math.random()}`

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-surface-lighter/30 border border-accent/20
            text-white placeholder-muted
            focus:outline-none focus:border-accent focus:bg-surface-lighter/50
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 font-semibold">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-muted">{helperText}</p>
      )}
    </div>
  )
}

export const InputForward = React.forwardRef(Input)
