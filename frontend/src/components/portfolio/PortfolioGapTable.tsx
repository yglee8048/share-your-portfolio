import type { GapItem } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatKRW } from '@/lib/utils'

interface Props {
  items: GapItem[]
}

function GapCell({ gap }: { gap: number | null }) {
  if (gap === null) return <span className="text-gray-300">–</span>

  const sign = gap > 0 ? '+' : ''
  const text = `${sign}${gap.toFixed(1)}%`

  if (gap < -5) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="font-semibold text-rose-500">{text}</span>
        <span className="text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">부족</span>
      </span>
    )
  }
  if (gap > 5) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="font-semibold text-amber-500">{text}</span>
        <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">초과</span>
      </span>
    )
  }
  return <span className="text-gray-500">{text}</span>
}

export default function PortfolioGapTable({ items }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-brand-100 bg-brand-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-600">종목</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">목표 비율</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">현재 비율</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">괴리</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">목표 금액</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">현재 금액</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">
          {items.map((item) => {
            const isMissing = item.current_ratio === null
            const isExtra = item.target_ratio === null

            return (
              <tr
                key={item.asset.ticker}
                className={[
                  isMissing ? 'bg-rose-50/40' : '',
                  isExtra ? 'opacity-70' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-gray-800 ${isExtra ? 'italic' : ''}`}>
                      {item.asset.name}
                    </span>
                    <Badge>{item.asset.type.label}</Badge>
                    {isMissing && (
                      <span className="text-xs text-rose-400">미보유</span>
                    )}
                    {isExtra && (
                      <span className="text-xs text-gray-400">포폴 외</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                  {item.target_ratio !== null
                    ? `${item.target_ratio.toFixed(1)}%`
                    : <span className="text-gray-300">–</span>}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                  {item.current_ratio !== null
                    ? `${item.current_ratio.toFixed(1)}%`
                    : <span className="text-gray-300">–</span>}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <GapCell gap={item.gap} />
                </td>
                <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                  {item.target_amount !== null
                    ? formatKRW(item.target_amount)
                    : <span className="text-gray-300">–</span>}
                </td>
                <td className="px-4 py-3 text-right text-gray-700 whitespace-nowrap">
                  {item.current_amount !== null
                    ? formatKRW(item.current_amount)
                    : <span className="text-gray-300">–</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
