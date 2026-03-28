import type { Currency } from '@/shared/types';
import { CURRENCY_SYMBOLS } from '@/shared/types';

export function formatKrw(amount: number): string {
  return `₩${Math.round(amount).toLocaleString('ko-KR')}`;
}

export function formatAmount(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === 'KRW') {
    return `${symbol}${Math.round(amount).toLocaleString('ko-KR')}`;
  }
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString('ja-JP')}`;
  }
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatRate(rate: number): string {
  const sign = rate > 0 ? '+' : '';
  return `${sign}${rate.toFixed(2)}%`;
}

export function formatGain(amount: number, currency: Currency): string {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${formatAmount(Math.abs(amount), currency)}`;
}

export function isPositive(value: number): boolean {
  return value > 0;
}

export function isNegative(value: number): boolean {
  return value < 0;
}

export function getProfitColor(value: number): string {
  if (value > 0) return 'secondary.main'; // 한국 금융 컨벤션: 상승=파랑(#005faf)
  if (value < 0) return 'error.main';     // 하락=빨강(#ac0c18)
  return 'text.secondary';
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}
