'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createHolding } from '@/lib/api'
import type { AssetMeta } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AssetAutocomplete from '@/components/ui/AssetAutocomplete'
import { getExposureLabel } from '@/lib/utils'

export default function NewHoldingPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<AssetMeta | null>(null)
  const [form, setForm] = useState({
    principal_value: '',
    current_value: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSelectAsset(asset: AssetMeta) {
    setSelectedAsset(asset)
    setErrors((e) => ({ ...e, asset: '' }))
  }

  function handleQueryChange(q: string) {
    setQuery(q)
    if (selectedAsset && q !== selectedAsset.name) {
      setSelectedAsset(null)
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!selectedAsset) newErrors.asset = '종목을 검색하여 선택해주세요.'
    if (!form.principal_value || isNaN(Number(form.principal_value)) || Number(form.principal_value) < 0) {
      newErrors.principal_value = '올바른 매입금액을 입력해주세요.'
    }
    if (form.current_value && (isNaN(Number(form.current_value)) || Number(form.current_value) < 0)) {
      newErrors.current_value = '올바른 평가금액을 입력해주세요.'
    }
    return newErrors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setError(null)
    try {
      await createHolding(accountId, {
        name: selectedAsset!.name,
        asset_type_code: selectedAsset!.asset_type_code,
        currency_exposure: selectedAsset!.currency_exposure,
        principal_value: Number(form.principal_value),
        ...(form.current_value ? { current_value: Number(form.current_value) } : {}),
      })
      router.push(`/accounts/${accountId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/accounts/${accountId}`)}
          className="text-brand-500 hover:text-brand-700 transition-colors text-sm"
        >
          ← 뒤로
        </button>
        <h1 className="text-xl font-bold text-gray-800">종목 추가</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AssetAutocomplete
            label="종목명"
            value={query}
            onChange={handleQueryChange}
            onSelect={handleSelectAsset}
            onClear={() => { setQuery(''); setSelectedAsset(null) }}
            error={errors.asset}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">자산 유형</label>
              <div className="w-full rounded-xl border border-brand-100 bg-gray-50 px-3 py-3 text-sm text-gray-500 min-h-[46px]">
                {selectedAsset ? selectedAsset.asset_type_label : <span className="text-gray-300">자동 입력</span>}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">환노출 여부</label>
              <div className="w-full rounded-xl border border-brand-100 bg-gray-50 px-3 py-3 text-sm text-gray-500 min-h-[46px]">
                {selectedAsset ? getExposureLabel(selectedAsset.currency_exposure) : <span className="text-gray-300">자동 입력</span>}
              </div>
            </div>
          </div>

          <Input
            label="매입금액"
            type="number"
            value={form.principal_value}
            onChange={(e) => setForm((f) => ({ ...f, principal_value: e.target.value }))}
            placeholder="0"
            min="0"
            step="any"
            error={errors.principal_value}
          />

          <Input
            label="평가금액 (선택사항)"
            type="number"
            value={form.current_value}
            onChange={(e) => setForm((f) => ({ ...f, current_value: e.target.value }))}
            placeholder="입력하지 않으면 수익률을 계산할 수 없습니다"
            min="0"
            step="any"
            error={errors.current_value}
          />

          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/accounts/${accountId}`)}
              className="flex-1"
            >
              취소
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? '저장 중...' : '종목 추가'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
