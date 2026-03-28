'use client';

import { MOCK_INSTITUTIONS, MOCK_ACCOUNT_TYPES, MOCK_ASSET_TYPES } from '@/shared/mock';

export function useInstitutions() {
  // TODO: Replace with metaApi.institutions() when API is ready
  return { institutions: MOCK_INSTITUTIONS };
}

export function useAccountTypes() {
  // TODO: Replace with metaApi.accountTypes() when API is ready
  return { accountTypes: MOCK_ACCOUNT_TYPES };
}

export function useAssetTypes() {
  // TODO: Replace with metaApi.assetTypes() when API is ready
  return { assetTypes: MOCK_ASSET_TYPES };
}
