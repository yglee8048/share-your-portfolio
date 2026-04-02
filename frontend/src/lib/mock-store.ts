import type { Account, Holding, CodeLabel } from '@/types'

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ── Meta ──────────────────────────────────────────────────────────────────────

export const INSTITUTIONS: CodeLabel[] = [
  { code: 'NH_INVESTMENT_SECURITIES', label: 'NH나무증권' },
  { code: 'MIRAE_ASSET_SECURITIES', label: '미래에셋증권' },
  { code: 'KOREA_INVESTMENT_SECURITIES', label: '한국투자증권' },
  { code: 'MIRAE_ASSET_INSURANCE', label: '미래에셋보험' },
  { code: 'KAKAO_BANK', label: '카카오뱅크' },
  { code: 'NH_BANK', label: '농협은행' },
  { code: 'SHINHAN_BANK', label: '신한은행' },
  { code: 'NAVER_PAY', label: '네이버페이' },
  { code: 'KAKAO_PAY', label: '카카오페이' },
]

export const ACCOUNT_TYPES: CodeLabel[] = [
  { code: 'DEMAND_DEPOSIT', label: '입출금' },
  { code: 'SUBSCRIPTION_ACCOUNT', label: '청약통장' },
  { code: 'CMA', label: 'CMA' },
  { code: 'ISA', label: 'ISA' },
  { code: 'IRP', label: 'IRP' },
  { code: 'PENSION_FUND', label: '연금저축펀드' },
  { code: 'VARIABLE_ANNUITY', label: '변액연금보험' },
  { code: 'DC', label: 'DC' },
  { code: 'DB', label: 'DB' },
]

export const ASSET_TYPES: CodeLabel[] = [
  { code: 'CASH', label: '현금' },
  { code: 'DEPOSIT', label: '예금' },
  { code: 'SAVINGS', label: '적금' },
  { code: 'NOTE', label: '어음' },
  { code: 'RP', label: 'RP' },
  { code: 'MMF', label: 'MMF' },
  { code: 'DOMESTIC_STOCK', label: '국내주식' },
  { code: 'FOREIGN_STOCK', label: '해외주식' },
  { code: 'DOMESTIC_BOND', label: '국내채권' },
  { code: 'FOREIGN_BOND', label: '해외채권' },
  { code: 'GOLD', label: '금' },
  { code: 'COMMODITY', label: '원자재' },
]

// ── Initial data ───────────────────────────────────────────────────────────────

const ACC1 = 'acc-001'
const ACC2 = 'acc-002'
const ACC3 = 'acc-003'

const initialHoldings: Holding[] = [
  {
    id: 'h-001',
    account_id: ACC1,
    asset_name: '삼성전자',
    asset_type: { code: 'DOMESTIC_STOCK', label: '국내주식' },
    currency: 'KRW',
    principal_value: 3600000,
    current_value: 3925000,
    unrealized_gain: 325000,
    profit_rate: 9.03,
  },
  {
    id: 'h-002',
    account_id: ACC1,
    asset_name: 'TIGER 미국S&P500',
    asset_type: { code: 'FOREIGN_STOCK', label: '해외주식' },
    currency: 'KRW',
    principal_value: 1420000,
    current_value: 1680000,
    unrealized_gain: 260000,
    profit_rate: 18.31,
  },
  {
    id: 'h-003',
    account_id: ACC1,
    asset_name: 'KODEX 국고채10년',
    asset_type: { code: 'DOMESTIC_BOND', label: '국내채권' },
    currency: 'KRW',
    principal_value: 1035000,
    current_value: 1012000,
    unrealized_gain: -23000,
    profit_rate: -2.22,
  },
  {
    id: 'h-004',
    account_id: ACC2,
    asset_name: 'TIGER 나스닥100',
    asset_type: { code: 'FOREIGN_STOCK', label: '해외주식' },
    currency: 'KRW',
    principal_value: 2640000,
    current_value: 3060000,
    unrealized_gain: 420000,
    profit_rate: 15.91,
  },
  {
    id: 'h-005',
    account_id: ACC2,
    asset_name: 'KODEX 골드선물',
    asset_type: { code: 'GOLD', label: '금' },
    currency: 'KRW',
    principal_value: 1000000,
    current_value: 1096000,
    unrealized_gain: 96000,
    profit_rate: 9.60,
  },
  {
    id: 'h-006',
    account_id: ACC3,
    asset_name: '카카오뱅크 CMA',
    asset_type: { code: 'CMA', label: 'CMA' },
    currency: 'KRW',
    principal_value: 5000000,
    current_value: null,
    unrealized_gain: null,
    profit_rate: null,
  },
]

// ── Account helpers ────────────────────────────────────────────────────────────

function computeAccount(
  base: Omit<Account, 'holdings_count' | 'current_value_krw' | 'principal_krw' | 'profit_rate'>,
  holdings: Holding[]
): Account {
  const mine = holdings.filter(h => h.account_id === base.id)
  const principal_krw = mine.reduce((s, h) => s + h.principal_value, 0)
  const current_value_krw = mine.reduce((s, h) => s + (h.current_value ?? h.principal_value), 0)
  const profit_rate =
    principal_krw > 0
      ? Math.round(((current_value_krw - principal_krw) / principal_krw) * 10000) / 100
      : 0
  return { ...base, holdings_count: mine.length, current_value_krw, principal_krw, profit_rate }
}

const initialAccountBases = [
  {
    id: ACC1,
    institution: { code: 'MIRAE_ASSET_SECURITIES', label: '미래에셋증권' },
    account_number: '****-****-1234',
    account_type: { code: 'ISA', label: 'ISA' },
    account_name: '주식 + ETF 위주',
  },
  {
    id: ACC2,
    institution: { code: 'NH_INVESTMENT_SECURITIES', label: 'NH나무증권' },
    account_number: '****-****-5678',
    account_type: { code: 'PENSION_FUND', label: '연금저축펀드' },
    account_name: '연금 장기 투자',
  },
  {
    id: ACC3,
    institution: { code: 'KAKAO_BANK', label: '카카오뱅크' },
    account_number: '****-****-9012',
    account_type: { code: 'CMA', label: 'CMA' },
    account_name: '생활비 및 비상금',
  },
]

// ── Mutable store ──────────────────────────────────────────────────────────────

let _holdings: Holding[] = [...initialHoldings]
let _accountBases = [...initialAccountBases]

function getAccounts(): Account[] {
  return _accountBases.map(base => computeAccount(base, _holdings))
}

function getAccount(id: string): Account {
  const base = _accountBases.find(a => a.id === id)
  if (!base) throw new Error('계좌를 찾을 수 없습니다.')
  return computeAccount(base, _holdings)
}

function createAccount(data: {
  institution_code: string
  account_number: string
  account_type_code: string
  account_name: string
}): Account {
  const institution = INSTITUTIONS.find(i => i.code === data.institution_code)!
  const account_type = ACCOUNT_TYPES.find(t => t.code === data.account_type_code)!
  const base = {
    id: uuid(),
    institution,
    account_number: data.account_number,
    account_type,
    account_name: data.account_name,
  }
  _accountBases = [..._accountBases, base]
  return computeAccount(base, _holdings)
}

function updateAccount(id: string, data: {
  institution_code: string
  account_number: string
  account_type_code: string
  account_name: string
}): Account {
  const institution = INSTITUTIONS.find(i => i.code === data.institution_code)!
  const account_type = ACCOUNT_TYPES.find(t => t.code === data.account_type_code)!
  _accountBases = _accountBases.map(a =>
    a.id === id
      ? { ...a, institution, account_number: data.account_number, account_type, account_name: data.account_name }
      : a
  )
  return getAccount(id)
}

function deleteAccount(id: string): void {
  _accountBases = _accountBases.filter(a => a.id !== id)
  _holdings = _holdings.filter(h => h.account_id !== id)
}

function getHoldings(accountId: string): Holding[] {
  if (!_accountBases.find(a => a.id === accountId)) throw new Error('계좌를 찾을 수 없습니다.')
  return _holdings.filter(h => h.account_id === accountId)
}

function buildHolding(
  id: string,
  accountId: string,
  data: { name: string; asset_type_code: string; currency: string; principal_value: number; current_value?: number }
): Holding {
  const asset_type = ASSET_TYPES.find(t => t.code === data.asset_type_code)!
  const current_value = data.current_value ?? null
  const unrealized_gain = current_value !== null ? current_value - data.principal_value : null
  const profit_rate =
    data.principal_value > 0 && unrealized_gain !== null
      ? Math.round((unrealized_gain / data.principal_value) * 10000) / 100
      : null
  return {
    id,
    account_id: accountId,
    asset_name: data.name,
    asset_type,
    currency: data.currency,
    principal_value: data.principal_value,
    current_value,
    unrealized_gain,
    profit_rate,
  }
}

function createHolding(
  accountId: string,
  data: { name: string; asset_type_code: string; currency: string; principal_value: number; current_value?: number }
): Holding {
  if (!_accountBases.find(a => a.id === accountId)) throw new Error('계좌를 찾을 수 없습니다.')
  const holding = buildHolding(uuid(), accountId, data)
  _holdings = [..._holdings, holding]
  return holding
}

function updateHolding(
  accountId: string,
  holdingId: string,
  data: { name: string; asset_type_code: string; currency: string; principal_value: number; current_value?: number }
): Holding {
  if (!_holdings.find(h => h.id === holdingId && h.account_id === accountId)) {
    throw new Error('종목을 찾을 수 없습니다.')
  }
  const updated = buildHolding(holdingId, accountId, data)
  _holdings = _holdings.map(h => (h.id === holdingId ? updated : h))
  return updated
}

function deleteHolding(accountId: string, holdingId: string): void {
  _holdings = _holdings.filter(h => !(h.id === holdingId && h.account_id === accountId))
}

// ── Delay helper ──────────────────────────────────────────────────────────────

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

export const mockStore = {
  getInstitutions: () => delay([...INSTITUTIONS]),
  getAccountTypes: () => delay([...ACCOUNT_TYPES]),
  getAssetTypes: () => delay([...ASSET_TYPES]),
  getAccounts: () => delay(getAccounts()),
  getAccount: (id: string) => delay(getAccount(id)),
  createAccount: (data: Parameters<typeof createAccount>[0]) => delay(createAccount(data)),
  updateAccount: (id: string, data: Parameters<typeof updateAccount>[1]) => delay(updateAccount(id, data)),
  deleteAccount: (id: string) => delay(deleteAccount(id), 200) as Promise<void>,
  getHoldings: (accountId: string) => delay(getHoldings(accountId)),
  createHolding: (accountId: string, data: Parameters<typeof createHolding>[1]) => delay(createHolding(accountId, data)),
  updateHolding: (accountId: string, holdingId: string, data: Parameters<typeof updateHolding>[2]) => delay(updateHolding(accountId, holdingId, data)),
  deleteHolding: (accountId: string, holdingId: string) => delay(deleteHolding(accountId, holdingId), 200) as Promise<void>,
}
