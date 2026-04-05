import { AlertTriangle } from 'lucide-react'
import type { GapItem } from '@/types'
import { formatKRW } from '@/lib/utils'

interface Props {
  items: GapItem[]
}

function getActionMessage(item: GapItem): string {
  if (item.target_ratio === null) {
    return `${item.asset.name}: 목표 비율 미설정 (포트폴리오 외 보유)`
  }
  if (item.gap === null) return item.asset.name

  if (item.gap < -5) {
    const diff =
      item.target_amount !== null && item.current_amount !== null
        ? item.target_amount - item.current_amount
        : null
    const suffix = diff !== null ? ` — ${formatKRW(Math.round(diff))} 추가 매수 필요` : ''
    return `${item.asset.name}: ${Math.abs(item.gap).toFixed(1)}% 부족${suffix}`
  }

  return `${item.asset.name}: ${item.gap.toFixed(1)}% 초과`
}

export default function RebalancingBanner({ items }: Props) {
  const actionItems = items.filter(
    (i) => i.target_ratio === null || (i.gap !== null && Math.abs(i.gap) > 5),
  )

  if (actionItems.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">리밸런싱이 필요합니다</p>
          <p className="text-xs text-amber-600 mt-0.5">
            목표 비율에서 벗어난 종목이 있습니다.
          </p>
          <ul className="mt-2 space-y-1">
            {actionItems.map((item) => (
              <li key={item.asset.ticker} className="text-xs text-amber-700">
                • {getActionMessage(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
