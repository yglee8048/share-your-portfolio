export function formatKRW(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

export function formatRate(rate: number | null): string {
  if (rate === null || rate === undefined) return '-'
  const sign = rate >= 0 ? '+' : ''
  return `${sign}${rate.toFixed(2)}%`
}

export function getRateColor(rate: number | null): string {
  if (rate === null || rate === undefined) return 'text-gray-400'
  if (rate < 0) return 'text-rose-400'
  if (rate > 0) return 'text-emerald-500'
  return 'text-gray-400'
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ko-KR')
}

export function getExposureLabel(currencyExposure: boolean): string {
  return currencyExposure ? '환노출Y' : '환노출N'
}
