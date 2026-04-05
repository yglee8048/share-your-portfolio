'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { AssetMeta, Portfolio, UpsertPortfolioRequest } from '@/types'
import Button from '@/components/ui/Button'
import AssetAutocomplete from '@/components/ui/AssetAutocomplete'

interface EditItem {
  asset: AssetMeta
  ratio: string
}

interface Props {
  portfolio: Portfolio | null
  onClose: () => void
  onSave: (data: UpsertPortfolioRequest) => Promise<void>
}

export default function PortfolioEditModal({ portfolio, onClose, onSave }: Props) {
  const [name, setName] = useState(portfolio?.name ?? '')
  const [description, setDescription] = useState(portfolio?.description ?? '')
  const [items, setItems] = useState<EditItem[]>(
    portfolio?.items.map((i) => ({ asset: i.asset, ratio: String(i.target_ratio) })) ?? [],
  )
  const [addQuery, setAddQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalRatio = items.reduce((sum, i) => sum + (parseFloat(i.ratio) || 0), 0)
  const ratioValid = items.length > 0 && Math.abs(totalRatio - 100) < 0.01
  const isValid = name.trim().length > 0 && ratioValid

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleSelectAsset(asset: AssetMeta) {
    if (items.some((i) => i.asset.ticker === asset.ticker)) return
    setItems((prev) => [...prev, { asset, ratio: '' }])
    setAddQuery('')
  }

  function handleRatioChange(ticker: string, value: string) {
    setItems((prev) =>
      prev.map((i) => (i.asset.ticker === ticker ? { ...i, ratio: value } : i)),
    )
  }

  function handleRemove(ticker: string) {
    setItems((prev) => prev.filter((i) => i.asset.ticker !== ticker))
  }

  async function handleSave() {
    setError(null)
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        items: items.map((i) => ({
          asset_ticker: i.asset.ticker,
          target_ratio: parseFloat(i.ratio),
        })),
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const totalColor = ratioValid
    ? 'text-emerald-600'
    : totalRatio > 0
      ? 'text-amber-500'
      : 'text-gray-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-100">
          <h2 className="text-base font-bold text-gray-800">
            {portfolio ? '포트폴리오 편집' : '포트폴리오 설정'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">포트폴리오 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 글로벌 분산 포트폴리오"
              className="w-full rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-300 transition-colors duration-150"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              투자 철학{' '}
              <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 바이앤홀드 전략 — 글로벌 분산 장기투자"
              rows={2}
              className="w-full rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-300 transition-colors duration-150 resize-none"
            />
          </div>

          {/* Items */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">목표 비율 설정</span>
              <span className={`text-sm font-semibold tabular-nums ${totalColor}`}>
                합계 {totalRatio.toFixed(1)}% / 100%
              </span>
            </div>

            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.asset.ticker}
                    className="flex items-center gap-2 bg-brand-50 rounded-xl px-3 py-2.5"
                  >
                    <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                      {item.asset.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={item.ratio}
                        onChange={(e) => handleRatioChange(item.asset.ticker, e.target.value)}
                        placeholder="0"
                        className="w-20 rounded-lg border border-brand-200 bg-white px-2 py-1.5 text-sm text-right text-gray-800 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-300"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.asset.ticker)}
                        className="ml-1 text-gray-400 hover:text-rose-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add asset autocomplete */}
            <div>
              <p className="text-xs text-gray-500 mb-1.5">종목 추가</p>
              <AssetAutocomplete
                value={addQuery}
                onChange={setAddQuery}
                onSelect={handleSelectAsset}
                onClear={() => setAddQuery('')}
              />
            </div>
          </div>

          {/* Validation */}
          {!name.trim() && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              포트폴리오 이름을 입력해주세요.
            </p>
          )}
          {items.length > 0 && !ratioValid && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              합계가 100%가 되어야 저장할 수 있습니다. (현재 {totalRatio.toFixed(1)}%)
            </p>
          )}

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-brand-100">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!isValid || saving}>
            {saving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  )
}
