import type { Account, Holding } from '@/shared/types';
import type {
  CreateAccountForm,
  UpdateAccountForm,
  CreateHoldingForm,
  UpdateHoldingForm,
} from '@/shared/types';

// TODO: import api from '@/shared/lib/api';
// API 연동 시 아래 함수들을 구현하고, hooks.ts에서 호출로 교체합니다.

export const accountApi = {
  list: async (): Promise<Account[]> => {
    // TODO: const res = await api.get('/api/accounts');
    // return res.data;
    throw new Error('accountApi.list: not implemented');
  },

  get: async (_id: string): Promise<Account> => {
    // TODO: const res = await api.get(`/api/accounts/${_id}`);
    // return res.data;
    throw new Error('accountApi.get: not implemented');
  },

  create: async (_form: CreateAccountForm): Promise<Account> => {
    // TODO: const res = await api.post('/api/accounts', _form);
    // return res.data;
    throw new Error('accountApi.create: not implemented');
  },

  update: async (_id: string, _form: UpdateAccountForm): Promise<Account> => {
    // TODO: const res = await api.put(`/api/accounts/${_id}`, _form);
    // return res.data;
    throw new Error('accountApi.update: not implemented');
  },

  remove: async (_id: string): Promise<void> => {
    // TODO: await api.delete(`/api/accounts/${_id}`);
    throw new Error('accountApi.remove: not implemented');
  },
};

export const holdingApi = {
  list: async (_accountId: string): Promise<Holding[]> => {
    // TODO: const res = await api.get(`/api/accounts/${_accountId}/holdings`);
    // return res.data;
    throw new Error('holdingApi.list: not implemented');
  },

  create: async (_accountId: string, _form: CreateHoldingForm): Promise<Holding> => {
    // TODO: const res = await api.post(`/api/accounts/${_accountId}/holdings`, _form);
    // return res.data;
    throw new Error('holdingApi.create: not implemented');
  },

  update: async (
    _accountId: string,
    _holdingId: string,
    _form: UpdateHoldingForm,
  ): Promise<Holding> => {
    // TODO: const res = await api.put(`/api/accounts/${_accountId}/holdings/${_holdingId}`, _form);
    // return res.data;
    throw new Error('holdingApi.update: not implemented');
  },

  remove: async (_accountId: string, _holdingId: string): Promise<void> => {
    // TODO: await api.delete(`/api/accounts/${_accountId}/holdings/${_holdingId}`);
    throw new Error('holdingApi.remove: not implemented');
  },
};
