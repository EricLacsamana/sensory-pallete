'use client'

import React from 'react'

interface TableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  columns: TableColumn[]
  data: any[]
  striped?: boolean
  hover?: boolean
  loading?: boolean
}

export function Table({
  columns,
  data,
  striped = true,
  hover = true,
  loading = false,
}: TableProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin text-accent">
          <span className="text-2xl">⏳</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p className="text-lg">No data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-accent/20 bg-surface-lighter/30">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-4 text-sm font-semibold text-muted uppercase tracking-wider
                  text-${column.align || 'left'}
                `}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className={`
                border-b border-accent/10 transition-all duration-200
                ${hover ? 'hover:bg-surface-lighter/30 cursor-pointer' : ''}
                ${striped && idx % 2 === 0 ? 'bg-surface-lighter/10' : ''}
              `}
            >
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.key}`}
                  className={`
                    px-6 py-4 text-sm text-slate-200
                    text-${column.align || 'left'}
                  `}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return <thead className="border-b border-accent/20 bg-surface-lighter/30">{children}</thead>
}

interface TableRowProps {
  children: React.ReactNode
  striped?: boolean
  hover?: boolean
}

export function TableRow({ children, striped, hover }: TableRowProps) {
  return (
    <tr
      className={`
        border-b border-accent/10 transition-all duration-200
        ${hover ? 'hover:bg-surface-lighter/30 cursor-pointer' : ''}
        ${striped ? 'odd:bg-surface-lighter/10' : ''}
      `}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function TableCell({
  children,
  align = 'left',
  className = '',
}: TableCellProps) {
  return (
    <td
      className={`
        px-6 py-4 text-sm text-slate-200
        text-${align}
        ${className}
      `}
    >
      {children}
    </td>
  )
}
