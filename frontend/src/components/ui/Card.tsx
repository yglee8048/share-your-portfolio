import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white rounded-2xl shadow-sm border border-brand-100 p-6',
        onClick ? 'cursor-pointer hover:shadow-md hover:border-brand-200 transition-all duration-150' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
