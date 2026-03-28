// ── 공통 ────────────────────────────────────────────────────────────────────────

/** 백엔드 enum 응답 공통 형태 */
export interface CodeLabel {
  code: string;
  label: string;
}

// ── 통화 (프론트에서 심볼 표시에만 사용) ──────────────────────────────────────

export type Currency = 'KRW' | 'USD' | 'JPY' | 'EUR' | 'GBP' | 'CNY' | 'HKD';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KRW: '₩',
  USD: '$',
  JPY: '¥',
  EUR: '€',
  GBP: '£',
  CNY: '¥',
  HKD: 'HK$',
};

// ── 도메인 엔티티 ──────────────────────────────────────────────────────────────

export interface Account {
  id: string;
  institution: CodeLabel;
  accountNumber: string;
  accountType: CodeLabel;
  currency: Currency;
  nickName: string;
  holdingsCount: number;
  currentValueKrw: number;
  principalKrw: number;
  profitRate: number;
}

export interface Holding {
  id: string;
  accountId: string;
  asset: { name: string; ticker?: string };
  assetType: CodeLabel;
  currency: Currency;
  averageBuyPrice: number;
  quantity: number;
  currentPrice?: number;
  principalAmount: number;
  currentValue?: number;
  unrealizedGain?: number;
  profitRate?: number;
}

// ── Form DTOs ──────────────────────────────────────────────────────────────────

export interface CreateAccountForm {
  institutionCode: string;
  accountNumber: string;
  accountTypeCode: string;
  currency: Currency | '';
  nickName: string;
}

export type UpdateAccountForm = CreateAccountForm;

export interface CreateHoldingForm {
  name: string;
  ticker: string;
  assetTypeCode: string;
  currency: Currency | '';
  averageBuyPrice: string;
  quantity: string;
  currentPrice: string;
}

export type UpdateHoldingForm = CreateHoldingForm;
