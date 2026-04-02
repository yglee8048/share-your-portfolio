'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getInstitutions, getAccountTypes, createAccount } from '@/lib/api'
import type { CodeLabel } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function NewAccountPage() {
  const router = useRouter()
  const [institutions, setInstitutions] = useState<CodeLabel[]>([])
  const [accountTypes, setAccountTypes] = useState<CodeLabel[]>([])
  const [loading, setLoading] = useState(false)
  const [metaLoading, setMetaLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    institution_code: '',
    account_number: '',
    account_type_code: '',
    account_name: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([getInstitutions(), getAccountTypes()])
      .then(([inst, types]) => {
        setInstitutions(inst)
        setAccountTypes(types)
        if (inst.length > 0)
          setForm((f) => ({ ...f, institution_code: inst[0].code }))
        if (types.length > 0)
          setForm((f) => ({ ...f, account_type_code: types[0].code }))
      })
      .catch((e) => setError(e.message))
      .finally(() => setMetaLoading(false))
  }, [])

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.institution_code) newErrors.institution_code = '금융기관을 선택해주세요.'
    if (!form.account_number.trim()) newErrors.account_number = '계좌번호를 입력해주세요.'
    if (!form.account_type_code) newErrors.account_type_code = '계좌 유형을 선택해주세요.'
    if (!form.account_name.trim()) newErrors.account_name = '계좌 별칭을 입력해주세요.'
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
      await createAccount(form)
      router.push('/accounts')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/accounts')}
          className="text-brand-500 hover:text-brand-700 transition-colors text-sm"
        >
          ← 뒤로
        </button>
        <h1 className="text-xl font-bold text-gray-800">새 계좌 등록</h1>
      </div>

      <Card>
        {metaLoading ? (
          <p className="text-sm text-gray-400 text-center py-8">
            불러오는 중...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="금융기관"
              value={form.institution_code}
              onChange={(e) =>
                setForm((f) => ({ ...f, institution_code: e.target.value }))
              }
              options={institutions.map((i) => ({
                value: i.code,
                label: i.label,
              }))}
              placeholder="금융기관을 선택하세요"
              error={errors.institution_code}
            />

            <Input
              label="계좌번호"
              value={form.account_number}
              onChange={(e) =>
                setForm((f) => ({ ...f, account_number: e.target.value }))
              }
              placeholder="계좌번호를 입력하세요"
              error={errors.account_number}
            />

            <Select
              label="계좌 유형"
              value={form.account_type_code}
              onChange={(e) =>
                setForm((f) => ({ ...f, account_type_code: e.target.value }))
              }
              options={accountTypes.map((t) => ({
                value: t.code,
                label: t.label,
              }))}
              placeholder="계좌 유형을 선택하세요"
              error={errors.account_type_code}
            />

            <Input
              label="계좌 별칭"
              value={form.account_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, account_name: e.target.value }))
              }
              placeholder="계좌 별칭을 입력하세요"
              error={errors.account_name}
            />

            {error && (
              <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/accounts')}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? '저장 중...' : '계좌 등록'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
