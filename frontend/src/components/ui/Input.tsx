import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'w-full rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400',
          'focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-300',
          'transition-colors duration-150',
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200' : '',
          props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  )
}
