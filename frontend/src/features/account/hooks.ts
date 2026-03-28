'use client';

import { useState } from 'react';
import { MOCK_ACCOUNTS, MOCK_HOLDINGS } from '@/shared/mock';
import type {
  Holding,
  CreateAccountForm,
  UpdateAccountForm,
  CreateHoldingForm,
  UpdateHoldingForm,
} from '@/shared/types';

export function useAccounts() {
  // TODO: Replace with accountApi.list() when API is ready
  return { accounts: MOCK_ACCOUNTS };
}

export function useAccount(id: string) {
  // TODO: Replace with accountApi.get(id) + holdingApi.list(id) when API is ready
  const account = MOCK_ACCOUNTS.find((a) => a.id === id) ?? null;
  const [holdings] = useState<Holding[]>(MOCK_HOLDINGS[id] ?? []);
  return { account, holdings };
}

export function useCreateAccount() {
  const [loading, setLoading] = useState(false);

  async function createAccount(form: CreateAccountForm) {
    setLoading(true);
    try {
      // TODO: await accountApi.create(form);
      console.log('createAccount:', form);
    } finally {
      setLoading(false);
    }
  }

  return { createAccount, loading };
}

export function useUpdateAccount() {
  const [loading, setLoading] = useState(false);

  async function updateAccount(id: string, form: UpdateAccountForm) {
    setLoading(true);
    try {
      // TODO: await accountApi.update(id, form);
      console.log('updateAccount:', id, form);
    } finally {
      setLoading(false);
    }
  }

  return { updateAccount, loading };
}

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);

  async function deleteAccount(id: string) {
    setLoading(true);
    try {
      // TODO: await accountApi.remove(id);
      console.log('deleteAccount:', id);
    } finally {
      setLoading(false);
    }
  }

  return { deleteAccount, loading };
}

export function useCreateHolding() {
  const [loading, setLoading] = useState(false);

  async function createHolding(accountId: string, form: CreateHoldingForm) {
    setLoading(true);
    try {
      // TODO: await holdingApi.create(accountId, form);
      console.log('createHolding:', accountId, form);
    } finally {
      setLoading(false);
    }
  }

  return { createHolding, loading };
}

export function useUpdateHolding() {
  const [loading, setLoading] = useState(false);

  async function updateHolding(accountId: string, holdingId: string, form: UpdateHoldingForm) {
    setLoading(true);
    try {
      // TODO: await holdingApi.update(accountId, holdingId, form);
      console.log('updateHolding:', accountId, holdingId, form);
    } finally {
      setLoading(false);
    }
  }

  return { updateHolding, loading };
}

export function useDeleteHolding() {
  const [loading, setLoading] = useState(false);

  async function deleteHolding(accountId: string, holdingId: string) {
    setLoading(true);
    try {
      // TODO: await holdingApi.remove(accountId, holdingId);
      console.log('deleteHolding:', accountId, holdingId);
    } finally {
      setLoading(false);
    }
  }

  return { deleteHolding, loading };
}
