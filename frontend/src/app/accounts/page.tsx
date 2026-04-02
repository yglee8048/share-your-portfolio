'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAccounts } from '@/lib/api'
import { formatKRW, formatRate, getRateColor } from '@/lib/utils'
import type { Account } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const totalValue = accounts.reduce((sum, a) => sum + a.current_value_krw, 0)
  const totalPrincipal = accounts.reduce((sum, a) => sum + a.principal_krw, 0)
  const overallRate =
    totalPrincipal > 0
      ? ((totalValue - totalPrincipal) / totalPrincipal) * 100
      : null

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="text-center py-16 text-rose-500">
        <p className="text-base font-medium">데이터를 불러오지 못했습니다.</p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-brand-500 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-brand-100 text-sm font-medium">총 자산</p>
            <p className="text-white text-3xl font-bold mt-1">
              {formatKRW(totalValue)}
            </p>
            <p className="text-brand-200 text-sm mt-1">
              원금 {formatKRW(totalPrincipal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-brand-200 text-xs mb-1">수익률</p>
            <p
              className={`text-2xl font-bold ${
                overallRate === null
                  ? 'text-white'
                  : overallRate >= 0
                  ? 'text-emerald-300'
                  : 'text-rose-300'
              }`}
            >
              {formatRate(overallRate)}
            </p>
          </div>
        </div>
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-700">
          계좌 목록{' '}
          <span className="text-brand-400 font-normal text-sm">
            ({accounts.length}개)
          </span>
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/accounts/new')}
        >
          + 새 계좌 등록
        </Button>
      </div>

      {/* Account List */}
      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">등록된 계좌가 없습니다.</p>
          <p className="text-gray-300 text-xs mt-1">
            새 계좌 등록 버튼을 눌러 계좌를 추가해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              onClick={() => router.push(`/accounts/${account.id}`)}
            >
              <div className="space-y-3">
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      {account.institution.label}
                    </span>
                    <Badge>{account.account_type.label}</Badge>
                  </div>
                  <span className="text-xs text-gray-400 bg-brand-50 px-2 py-0.5 rounded-full">
                    {account.holdings_count}종목
                  </span>
                </div>

                {/* Account Name */}
                <div>
                  <p className="font-semibold text-gray-800">
                    {account.account_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {account.account_number}
                  </p>
                </div>

                {/* Values */}
                <div className="flex items-end justify-between pt-1 border-t border-brand-50">
                  <div>
                    <p className="text-xs text-gray-400">현재가치</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatKRW(account.current_value_krw)}
                    </p>
                    <p className="text-xs text-gray-400">
                      원금 {formatKRW(account.principal_krw)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">수익률</p>
                    <p
                      className={`text-xl font-bold ${getRateColor(
                        account.profit_rate
                      )}`}
                    >
                      {formatRate(account.profit_rate)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
