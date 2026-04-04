import type {Account, AssetMeta, CodeLabel, CreateAccountRequest, CreateHoldingRequest, Holding,} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    })

    if (res.status === 204) {
        return undefined as T
    }

    const body = await res.json()

    if (!res.ok) {
        const message = body?.error_message || body?.message || `요청 처리 중 오류가 발생했습니다. (${res.status})`
        throw new Error(message)
    }

    return body.data as T
}

// Meta
export function getInstitutions(): Promise<CodeLabel[]> {
    return fetchAPI<CodeLabel[]>('/api/v1/meta/institutions')
}

export function getAccountTypes(): Promise<CodeLabel[]> {
    return fetchAPI<CodeLabel[]>('/api/v1/meta/account-types')
}

export function getAssetTypes(): Promise<CodeLabel[]> {
    return fetchAPI<CodeLabel[]>('/api/v1/meta/asset-types')
}

export function searchAssets(query: string): Promise<AssetMeta[]> {
    return fetchAPI<AssetMeta[]>(`/api/v1/meta/assets?q=${encodeURIComponent(query)}`)
}

// Accounts
export function getAccounts(): Promise<Account[]> {
    return fetchAPI<Account[]>('/api/v1/accounts')
}

export function getAccount(id: string): Promise<Account> {
    return fetchAPI<Account>(`/api/v1/accounts/${id}`)
}

export function createAccount(data: CreateAccountRequest): Promise<Account> {
    return fetchAPI<Account>('/api/v1/accounts', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export function updateAccount(
    id: string,
    data: CreateAccountRequest
): Promise<Account> {
    return fetchAPI<Account>(`/api/v1/accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export function deleteAccount(id: string): Promise<void> {
    return fetchAPI<void>(`/api/v1/accounts/${id}`, {
        method: 'DELETE',
    })
}

// Holdings
export function getHoldings(accountId: string): Promise<Holding[]> {
    return fetchAPI<Holding[]>(`/api/v1/accounts/${accountId}/holdings`)
}

export function createHolding(
    accountId: string,
    data: CreateHoldingRequest
): Promise<Holding> {
    return fetchAPI<Holding>(`/api/v1/accounts/${accountId}/holdings`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export function updateHolding(
    accountId: string,
    holdingId: string,
    data: CreateHoldingRequest
): Promise<Holding> {
    return fetchAPI<Holding>(`/api/v1/accounts/${accountId}/holdings/${holdingId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export function deleteHolding(
    accountId: string,
    holdingId: string
): Promise<void> {
    return fetchAPI<void>(`/api/v1/accounts/${accountId}/holdings/${holdingId}`, {
        method: 'DELETE',
    })
}
