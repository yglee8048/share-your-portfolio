'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAssetTypes, createHolding } from '@/lib/api'
import type { CodeLabel } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

const CURRENCY_OPTIONS = [
  { value: 'KRW', label: 'KRW (원)' },
  { value: 'USD', label: 'USD (달러)' },
  { value: 'JPY', label: 'JPY (엔)' },
  { value: 'EUR', label: 'EUR (유로)' },
]

export default function NewHoldingPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [assetTypes, setAssetTypes] = useState<CodeLabel[]>([])
  const [loading, setLoading] = useState(false)
  const [metaLoading, setMetaLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    asset_type_code: '',
    currency: 'KRW',
    principal_value: '',
    current_value: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    getAssetTypes()
      .then((types) => {
        setAssetTypes(types)
        if (types.length > 0) setForm((f) => ({ ...f, asset_type_code: types[0].code }))
      })
      .catch((e) => setError(e.message))
      .finally(() => setMetaLoading(false))
  }, [])

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = '종목명을 입력해주세요.'
    if (!form.asset_type_code) newErrors.asset_type_code = '자산 유형을 선택해주세요.'
    if (!form.currency) newErrors.currency = '통화를 선택해주세요.'
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
        name: form.name,
        asset_type_code: form.asset_type_code,
        currency: form.currency,
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
        {metaLoading ? (
          <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="종목명"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="예: 삼성전자, 카카오뱅크 예금"
              error={errors.name}
            />

            <Select
              label="자산 유형"
              value={form.asset_type_code}
              onChange={(e) => setForm((f) => ({ ...f, asset_type_code: e.target.value }))}
              options={assetTypes.map((t) => ({ value: t.code, label: t.label }))}
              placeholder="자산 유형을 선택하세요"
              error={errors.asset_type_code}
            />

            <Select
              label="통화"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              options={CURRENCY_OPTIONS}
              error={errors.currency}
            />

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
        )}
      </Card>
    </div>
  )
}
