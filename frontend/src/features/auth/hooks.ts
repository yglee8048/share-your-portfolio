'use client';

import { useState } from 'react';
import type { Invitation } from '@/shared/types';

export function useInvitations(initial: Invitation[]) {
  const [invitations, setInvitations] = useState<Invitation[]>(initial);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function generate() {
    const code = Math.random().toString(36).slice(2, 10).toUpperCase();
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    setInvitations((prev) => [{ code, status: 'PENDING', expiresAt }, ...prev]);
    // TODO: await api.post('/api/invitations');
  }

  function remove(code: string) {
    setInvitations((prev) => prev.filter((i) => i.code !== code));
    // TODO: await api.delete(`/api/invitations/${code}`);
  }

  function copy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return { invitations, copiedCode, generate, remove, copy };
}
