import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
  secondary:
    'bg-brand-100 text-brand-700 hover:bg-brand-200 active:bg-brand-300',
  ghost:
    'bg-transparent text-brand-600 hover:bg-brand-50 active:bg-brand-100',
  danger:
    'bg-rose-100 text-rose-600 hover:bg-rose-200 active:bg-rose-300',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
