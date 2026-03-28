import type { CodeLabel } from '@/shared/types';

// TODO: import api from '@/shared/lib/api';
// API 연동 시 아래 함수들을 구현하고, hooks.ts에서 호출로 교체합니다.

export const metaApi = {
  institutions: async (): Promise<CodeLabel[]> => {
    // TODO: const res = await api.get('/api/meta/institutions');
    // return res.data;
    throw new Error('metaApi.institutions: not implemented');
  },

  accountTypes: async (): Promise<CodeLabel[]> => {
    // TODO: const res = await api.get('/api/meta/account-types');
    // return res.data;
    throw new Error('metaApi.accountTypes: not implemented');
  },

  assetTypes: async (): Promise<CodeLabel[]> => {
    // TODO: const res = await api.get('/api/meta/asset-types');
    // return res.data;
    throw new Error('metaApi.assetTypes: not implemented');
  },
};
