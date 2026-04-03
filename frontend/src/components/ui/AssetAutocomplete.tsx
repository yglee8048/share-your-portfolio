'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { searchAssets } from '@/lib/api'
import { getExposureLabel } from '@/lib/utils'
import type { AssetMeta } from '@/types'

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  onSelect: (asset: AssetMeta) => void
  onClear: () => void
  error?: string
}

export default function AssetAutocomplete({ label, value, onChange, onSelect, onClear, error }: Props) {
  const [results, setResults] = useState<AssetMeta[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!value.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    timerRef.current = setTimeout(async () => {
      const data = await searchAssets(value)
      setResults(data)
      setOpen(data.length > 0)
      setActiveIndex(-1)
    }, 250)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleSelect(asset: AssetMeta) {
    onSelect(asset)
    onChange(asset.name)
    setOpen(false)
    setResults([])
  }

  const inputId = label ? label.replace(/\s+/g, '-').toLowerCase() : undefined

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 relative">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="종목명을 입력하여 검색하세요"
          autoComplete="off"
          className={[
            'w-full rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400',
            'focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-300',
            'transition-colors duration-150',
            value ? 'pr-9' : '',
            error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {value && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onClear() }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            <X size={14} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}

      {open && (
        <ul className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-brand-100 rounded-xl shadow-lg overflow-hidden">
          {results.map((asset, i) => (
            <li
              key={`${asset.name}-${asset.asset_type_code}`}
              onMouseDown={() => handleSelect(asset)}
              onMouseEnter={() => setActiveIndex(i)}
              className={[
                'flex items-center justify-between px-3 py-2.5 cursor-pointer text-sm transition-colors',
                i === activeIndex ? 'bg-brand-50' : 'hover:bg-gray-50',
              ].join(' ')}
            >
              <span className="font-medium text-gray-800">{asset.name}</span>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {asset.asset_type_label}
                </span>
                <span className="text-xs text-gray-400">{getExposureLabel(asset.currency_exposure)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
