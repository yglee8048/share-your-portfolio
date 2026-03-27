'use client';

import { useState } from 'react';
import type { ExchangeRate, Currency } from '@/shared/types';

export function useExchangeRates(initial: ExchangeRate[]) {
  const [rates, setRates] = useState<ExchangeRate[]>(initial);
  const [rateInputs, setRateInputs] = useState<Record<string, string>>(
    Object.fromEntries(initial.map((r) => [r.currency, String(r.rateToKrw)])),
  );
  const [savedCurrency, setSavedCurrency] = useState<string | null>(null);

  function setInput(currency: string, value: string) {
    setRateInputs((prev) => ({ ...prev, [currency]: value }));
  }

  function save(currency: Currency) {
    const newRate = parseFloat(rateInputs[currency]);
    if (isNaN(newRate) || newRate <= 0) return;

    setRates((prev) =>
      prev.map((r) =>
        r.currency === currency
          ? { ...r, rateToKrw: newRate, updatedAt: new Date().toISOString() }
          : r,
      ),
    );
    setSavedCurrency(currency);
    setTimeout(() => setSavedCurrency(null), 2000);

    // TODO: await api.put(`/api/exchange-rates/${currency}`, { rateToKrw: newRate });
  }

  return { rates, rateInputs, setInput, save, savedCurrency };
}
