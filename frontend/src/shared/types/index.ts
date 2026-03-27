export type Institution =
  | 'SAMSUNG_SECURITIES'
  | 'MIRAE_ASSET'
  | 'KOREA_INVESTMENT'
  | 'KB_SECURITIES'
  | 'NH_INVESTMENT'
  | 'SHINHAN_INVESTMENT'
  | 'KIWOOM'
  | 'TOSS_SECURITIES'
  | 'KAKAO_PAY_SECURITIES'
  | 'KB_BANK'
  | 'SHINHAN_BANK'
  | 'HANA_BANK'
  | 'WOORI_BANK'
  | 'NH_BANK'
  | 'OTHER';

export const INSTITUTION_LABELS: Record<Institution, string> = {
  SAMSUNG_SECURITIES: '삼성증권',
  MIRAE_ASSET: '미래에셋증권',
  KOREA_INVESTMENT: '한국투자증권',
  KB_SECURITIES: 'KB증권',
  NH_INVESTMENT: 'NH투자증권',
  SHINHAN_INVESTMENT: '신한투자증권',
  KIWOOM: '키움증권',
  TOSS_SECURITIES: '토스증권',
  KAKAO_PAY_SECURITIES: '카카오페이증권',
  KB_BANK: 'KB국민은행',
  SHINHAN_BANK: '신한은행',
  HANA_BANK: '하나은행',
  WOORI_BANK: '우리은행',
  NH_BANK: 'NH농협은행',
  OTHER: '기타',
};

export type AccountType = 'ISA' | 'IRP' | 'DC' | 'CMA' | 'BROKERAGE' | 'DEPOSIT' | 'SAVINGS' | 'OTHER';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  ISA: 'ISA',
  IRP: 'IRP',
  DC: 'DC',
  CMA: 'CMA',
  BROKERAGE: '일반주식',
  DEPOSIT: '예금',
  SAVINGS: '적금',
  OTHER: '기타',
};

export type AssetType =
  | 'DOMESTIC_STOCK'
  | 'US_STOCK'
  | 'OTHER_FOREIGN_STOCK'
  | 'DOMESTIC_ETF'
  | 'FOREIGN_ETF'
  | 'BOND'
  | 'DEPOSIT'
  | 'SAVINGS'
  | 'CASH'
  | 'GOLD'
  | 'COMMODITY'
  | 'REAL_ESTATE'
  | 'OTHER';

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  DOMESTIC_STOCK: '국내주식',
  US_STOCK: '미국주식',
  OTHER_FOREIGN_STOCK: '기타해외주식',
  DOMESTIC_ETF: '국내ETF',
  FOREIGN_ETF: '해외ETF',
  BOND: '채권',
  DEPOSIT: '예금',
  SAVINGS: '적금',
  CASH: '현금',
  GOLD: '금',
  COMMODITY: '원자재',
  REAL_ESTATE: '부동산',
  OTHER: '기타',
};

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

export const FOREIGN_CURRENCIES: Currency[] = ['USD', 'JPY', 'EUR', 'GBP', 'CNY', 'HKD'];

export interface Account {
  id: string;
  institution: Institution;
  accountNumber: string;
  accountType: AccountType;
  memo?: string;
  holdingsCount: number;
  currentValueKrw: number;
  principalKrw: number;
  profitRate: number;
}

export interface Holding {
  id: string;
  accountId: string;
  asset: { name: string; ticker?: string };
  assetType: AssetType;
  currency: Currency;
  averageBuyPrice: number;
  quantity: number;
  currentPrice?: number;
  tags: string[];
  principalAmount: number;
  currentValue?: number;
  unrealizedGain?: number;
  profitRate?: number;
}

export interface ExchangeRate {
  currency: Currency;
  rateToKrw: number;
  updatedAt: string;
}

export interface Invitation {
  code: string;
  status: 'PENDING' | 'USED' | 'EXPIRED';
  expiresAt: string;
}

// ── Form DTOs ──────────────────────────────────────────────────────────────────

export interface CreateAccountForm {
  institution: Institution | '';
  accountNumber: string;
  accountType: AccountType | '';
  memo: string;
}

export interface CreateHoldingForm {
  name: string;
  ticker: string;
  assetType: AssetType | '';
  currency: Currency | '';
  averageBuyPrice: string;
  quantity: string;
  currentPrice: string;
  tags: string;
}
