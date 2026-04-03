import type {
  CodeLabel,
  AssetMeta,
  Account,
  Holding,
  CreateAccountRequest,
  CreateHoldingRequest,
} from '@/types'
import { mockStore } from './mock-store'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    let message = `요청 처리 중 오류가 발생했습니다. (${res.status})`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
      else if (body?.error) message = body.error
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

// Meta
export function getInstitutions(): Promise<CodeLabel[]> {
  if (USE_MOCK) return mockStore.getInstitutions()
  return fetchAPI<CodeLabel[]>('/api/meta/institutions')
}

export function getAccountTypes(): Promise<CodeLabel[]> {
  if (USE_MOCK) return mockStore.getAccountTypes()
  return fetchAPI<CodeLabel[]>('/api/meta/account-types')
}

export function getAssetTypes(): Promise<CodeLabel[]> {
  if (USE_MOCK) return mockStore.getAssetTypes()
  return fetchAPI<CodeLabel[]>('/api/meta/asset-types')
}

export function searchAssets(query: string): Promise<AssetMeta[]> {
  if (USE_MOCK) return mockStore.searchAssets(query)
  return fetchAPI<AssetMeta[]>(`/api/meta/assets?q=${encodeURIComponent(query)}`)
}

// Accounts
export function getAccounts(): Promise<Account[]> {
  if (USE_MOCK) return mockStore.getAccounts()
  return fetchAPI<Account[]>('/api/accounts')
}

export function getAccount(id: string): Promise<Account> {
  if (USE_MOCK) return mockStore.getAccount(id)
  return fetchAPI<Account>(`/api/accounts/${id}`)
}

export function createAccount(data: CreateAccountRequest): Promise<Account> {
  if (USE_MOCK) return mockStore.createAccount(data)
  return fetchAPI<Account>('/api/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateAccount(
  id: string,
  data: CreateAccountRequest
): Promise<Account> {
  if (USE_MOCK) return mockStore.updateAccount(id, data)
  return fetchAPI<Account>(`/api/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteAccount(id: string): Promise<void> {
  if (USE_MOCK) return mockStore.deleteAccount(id)
  return fetchAPI<void>(`/api/accounts/${id}`, {
    method: 'DELETE',
  })
}

// Holdings
export function getHoldings(accountId: string): Promise<Holding[]> {
  if (USE_MOCK) return mockStore.getHoldings(accountId)
  return fetchAPI<Holding[]>(`/api/accounts/${accountId}/holdings`)
}

export function createHolding(
  accountId: string,
  data: CreateHoldingRequest
): Promise<Holding> {
  if (USE_MOCK) return mockStore.createHolding(accountId, data)
  return fetchAPI<Holding>(`/api/accounts/${accountId}/holdings`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateHolding(
  accountId: string,
  holdingId: string,
  data: CreateHoldingRequest
): Promise<Holding> {
  if (USE_MOCK) return mockStore.updateHolding(accountId, holdingId, data)
  return fetchAPI<Holding>(`/api/accounts/${accountId}/holdings/${holdingId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteHolding(
  accountId: string,
  holdingId: string
): Promise<void> {
  if (USE_MOCK) return mockStore.deleteHolding(accountId, holdingId)
  return fetchAPI<void>(`/api/accounts/${accountId}/holdings/${holdingId}`, {
    method: 'DELETE',
  })
}
