'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BarChart3, Pencil, Trash2 } from 'lucide-react'
import {
  deletePortfolio,
  getAccount,
  getPortfolio,
  getPortfolioGap,
  upsertPortfolio,
} from '@/lib/api'
import type { Account, Portfolio, PortfolioGap, UpsertPortfolioRequest } from '@/types'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PortfolioGapTable from '@/components/portfolio/PortfolioGapTable'
import RebalancingBanner from '@/components/portfolio/RebalancingBanner'
import PortfolioEditModal from '@/components/portfolio/PortfolioEditModal'

export default function PortfolioPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [account, setAccount] = useState<Account | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null | undefined>(undefined)
  const [gap, setGap] = useState<PortfolioGap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [acc, pf] = await Promise.all([getAccount(id), getPortfolio(id)])
      setAccount(acc)
      setPortfolio(pf)

      if (pf) {
        const gapData = await getPortfolioGap(id)
        setGap(gapData)
      } else {
        setGap(null)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSave(data: UpsertPortfolioRequest) {
    await upsertPortfolio(id, data)
    setShowModal(false)
    await loadData()
  }

  async function handleDelete() {
    if (!window.confirm('포트폴리오를 삭제하시겠습니까?')) return
    try {
      await deletePortfolio(id)
      setPortfolio(null)
      setGap(null)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading || portfolio === undefined) return <LoadingSpinner />

  if (error) {
    return (
      <div className="text-center py-16 text-rose-500">
        <p className="text-base font-medium">데이터를 불러오지 못했습니다.</p>
        <p className="text-sm text-gray-400 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/accounts/${id}`)}
            className="text-brand-500 hover:text-brand-700 transition-colors text-sm"
          >
            ← {account?.account_name ?? '계좌 상세'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {portfolio ? portfolio.name : '목표 포트폴리오'}
          </h1>
          {portfolio && (
            <div className="flex gap-1">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>
                <Pencil size={14} />
                편집
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 size={14} />
                삭제
              </Button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!portfolio && (
          <div className="bg-white rounded-2xl shadow-sm border border-brand-100 px-6 py-16 text-center">
            <BarChart3 size={40} className="mx-auto text-brand-200 mb-4" />
            <p className="text-gray-500 font-medium">아직 목표 포트폴리오가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">
              투자 전략을 설정하고 현재 상태와 비교해보세요.
            </p>
            <Button variant="primary" className="mt-6" onClick={() => setShowModal(true)}>
              포트폴리오 설정하기
            </Button>
          </div>
        )}

        {/* Portfolio view */}
        {portfolio && gap && (
          <>
            {/* Description */}
            {portfolio.description && (
              <div className="bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4">
                <p className="text-xs font-medium text-brand-400 mb-1">투자 철학</p>
                <p className="text-sm text-gray-700 italic">"{portfolio.description}"</p>
              </div>
            )}

            {/* Status / Rebalancing banner */}
            {gap.needs_rebalancing ? (
              <RebalancingBanner items={gap.items} />
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                <span>✓</span>
                <span>포트폴리오가 목표에 근접합니다.</span>
              </div>
            )}

            {/* Gap table */}
            <PortfolioGapTable items={gap.items} />
          </>
        )}
      </div>

      {/* Edit / Create modal */}
      {showModal && (
        <PortfolioEditModal
          portfolio={portfolio}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  )
}
