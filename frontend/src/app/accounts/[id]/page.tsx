'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  getAccount,
  getHoldings,
  deleteAccount,
  deleteHolding,
} from '@/lib/api'
import { formatKRW, formatRate, getRateColor, getExposureLabel } from '@/lib/utils'
import type { Account, Holding } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { BarChart3, Pencil, Trash2 } from 'lucide-react'

export default function AccountDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [account, setAccount] = useState<Account | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getAccount(id), getHoldings(id)])
      .then(([acc, hlds]) => {
        setAccount(acc)
        setHoldings(hlds)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDeleteAccount() {
    if (!window.confirm('계좌를 삭제하시겠습니까? 모든 종목 정보도 함께 삭제됩니다.')) return
    try {
      await deleteAccount(id)
      router.push('/accounts')
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.')
    }
  }

  async function handleDeleteHolding(holdingId: number, name: string) {
    if (!window.confirm(`"${name}" 종목을 삭제하시겠습니까?`)) return
    try {
      await deleteHolding(id, String(holdingId))
      setHoldings((prev) => prev.filter((h) => h.id !== holdingId))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) return <LoadingSpinner />

  if (error || !account) {
    return (
      <div className="text-center py-16 text-rose-500">
        <p className="text-base font-medium">데이터를 불러오지 못했습니다.</p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    )
  }

  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value ?? 0), 0)
  const totalPrincipal = holdings.reduce((sum, h) => sum + h.principal_value, 0)
  const totalGain = holdings.reduce((sum, h) => sum + (h.unrealized_gain ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/accounts')}
          className="text-brand-500 hover:text-brand-700 transition-colors text-sm"
        >
          ← 목록
        </button>
        <h1 className="text-xl font-bold text-gray-800">계좌 상세</h1>
      </div>

      {/* Account Info Card */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {account.institution.label}
              </span>
              <Badge>{account.account_type.label}</Badge>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {account.account_name}
            </p>
            <p className="text-xs text-gray-400">{account.account_number}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/accounts/${id}/edit`)}
              title="수정"
            >
              <Pencil size={14} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteAccount}
              title="삭제"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Account Summary */}
        <div className="mt-4 pt-4 border-t border-brand-50 grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">평가금액</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {formatKRW(account.current_value_krw)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">원금</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              {formatKRW(account.principal_krw)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">손익</p>
            <p
              className={`text-sm font-semibold mt-0.5 ${
                totalGain >= 0 ? 'text-emerald-500' : 'text-rose-400'
              }`}
            >
              {totalGain >= 0 ? '+' : ''}
              {formatKRW(totalGain)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">수익률</p>
            <p
              className={`text-sm font-semibold mt-0.5 ${getRateColor(
                account.profit_rate
              )}`}
            >
              {formatRate(account.profit_rate)}
            </p>
          </div>
        </div>
      </Card>

      {/* Holdings Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-700">
          보유 종목{' '}
          <span className="text-brand-400 font-normal text-sm">
            ({holdings.length}개)
          </span>
        </h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push(`/accounts/${id}/holdings/new`)}
        >
          + 종목 추가
        </Button>
      </div>

      {/* Portfolio link */}
      <button
        onClick={() => router.push(`/accounts/${id}/portfolio`)}
        className="w-full flex items-center justify-between bg-brand-50 hover:bg-brand-100 border border-brand-100 rounded-2xl px-4 py-3 transition-colors duration-150"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
          <BarChart3 size={16} />
          목표 포트폴리오
        </div>
        <span className="text-xs text-brand-400">괴리 분석 보기 →</span>
      </button>

      {holdings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">보유 종목이 없습니다.</p>
          <p className="text-gray-300 text-xs mt-1">
            종목 추가 버튼을 눌러 종목을 등록해보세요.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {holdings.map((holding) => (
              <Card key={holding.id} className="!p-3">
                <div className="space-y-1.5">
                  {/* Row 1: 종목명 + 배지 | 수익률 + 버튼 */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <span className="font-semibold text-gray-800 text-sm">
                        {holding.asset.name}
                      </span>
                      <Badge>{holding.asset.type.label}</Badge>
                      <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
                        {getExposureLabel(holding.asset.currency_exposure)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {holding.profit_rate !== null && (
                        <span className={`text-sm font-semibold ${getRateColor(holding.profit_rate)}`}>
                          {formatRate(holding.profit_rate)}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/accounts/${id}/holdings/${holding.id}/edit`)
                        }
                        title="수정"
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          handleDeleteHolding(holding.id, holding.asset.name)
                        }
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: 매입 | 평가 | 손익 인라인 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      매입{' '}
                      <span className="text-gray-700">{formatKRW(holding.principal_value)}</span>
                    </span>
                    <span className="text-gray-200">|</span>
                    <span>
                      평가{' '}
                      <span className="text-gray-700">
                        {holding.current_value !== null ? formatKRW(holding.current_value) : '–'}
                      </span>
                    </span>
                    {holding.unrealized_gain !== null && (
                      <>
                        <span className="text-gray-200">|</span>
                        <span>
                          손익{' '}
                          <span className={`font-medium ${getRateColor(holding.unrealized_gain)}`}>
                            {holding.unrealized_gain >= 0 ? '+' : ''}
                            {formatKRW(holding.unrealized_gain)}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
