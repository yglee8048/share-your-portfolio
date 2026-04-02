import React from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        {...props}
        className={[
          'w-full rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm text-gray-800',
          'focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-300',
          'transition-colors duration-150 appearance-none',
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200' : '',
          props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  )
}
