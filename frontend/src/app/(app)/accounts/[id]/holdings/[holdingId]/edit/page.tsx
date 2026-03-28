'use client';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink,
  InputAdornment,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { useAccount, useUpdateHolding, useDeleteHolding } from '@/features/account/hooks';
import { useAssetTypes } from '@/features/meta/hooks';
import { formatAmount, formatRate, getProfitColor } from '@/shared/lib/format';
import type { Currency, UpdateHoldingForm } from '@/shared/types';
import { CURRENCY_SYMBOLS } from '@/shared/types';

const CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY', 'EUR', 'GBP', 'CNY', 'HKD'];

export default function EditHoldingPage({
  params,
}: {
  params: Promise<{ id: string; holdingId: string }>;
}) {
  const { id, holdingId } = use(params);
  const router = useRouter();
  const { account, holdings } = useAccount(id);
  const { updateHolding, loading: saving } = useUpdateHolding();
  const { deleteHolding, loading: deleting } = useDeleteHolding();
  const { assetTypes } = useAssetTypes();

  const holding = holdings.find((h) => h.id === holdingId);
  const [form, setForm] = useState<UpdateHoldingForm | null>(null);

  // 종목 로드 후 초기값 설정 (한 번만)
  if (holding && form === null) {
    setForm({
      name: holding.asset.name,
      ticker: holding.asset.ticker ?? '',
      assetTypeCode: holding.assetType.code,
      currency: holding.currency,
      averageBuyPrice: String(holding.averageBuyPrice),
      quantity: String(holding.quantity),
      currentPrice: holding.currentPrice != null ? String(holding.currentPrice) : '',
    });
  }

  if (!account || !holding) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          종목을 찾을 수 없습니다.
        </Typography>
        <Button onClick={() => router.push(`/accounts/${id}`)} sx={{ mt: 2 }}>
          계좌 상세로
        </Button>
      </Box>
    );
  }

  if (!form) return null;

  function handleChange(field: keyof UpdateHoldingForm, value: string) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    await updateHolding(id, holdingId, form);
    router.push(`/accounts/${id}`);
  }

  async function handleDelete() {
    if (!confirm(`'${holding?.asset.name}' 종목을 삭제하시겠습니까?`)) return;
    await deleteHolding(id, holdingId);
    router.push(`/accounts/${id}`);
  }

  const isValid =
    form.name.trim() && form.assetTypeCode && form.currency && form.averageBuyPrice && form.quantity;

  const currencySymbol = form.currency ? CURRENCY_SYMBOLS[form.currency as Currency] : '';
  const accountLabel = account.nickName;

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <MuiLink
          underline="hover"
          color="text.secondary"
          onClick={() => router.push('/accounts')}
          sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
        >
          계좌
        </MuiLink>
        <MuiLink
          underline="hover"
          color="text.secondary"
          onClick={() => router.push(`/accounts/${id}`)}
          sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
        >
          {accountLabel}
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
          종목 수정
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {holding.asset.name}
          {holding.asset.ticker && ` · ${holding.asset.ticker}`}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          종목 수정
        </Typography>
      </Box>

      {/* 현재 수익 현황 */}
      {holding.profitRate != null && (
        <Card elevation={0} sx={{ mb: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                bgcolor: '#e8f5e9',
              }}
            >
              {[
                {
                  label: '원금',
                  value: formatAmount(holding.principalAmount, holding.currency),
                  color: 'text.primary',
                },
                {
                  label: '현재 가치',
                  value: holding.currentValue != null
                    ? formatAmount(holding.currentValue, holding.currency)
                    : '—',
                  color: 'text.primary',
                },
                {
                  label: '평가 손익',
                  value: holding.unrealizedGain != null
                    ? `${holding.unrealizedGain > 0 ? '+' : ''}${formatAmount(holding.unrealizedGain, holding.currency)}`
                    : '—',
                  color: holding.unrealizedGain != null ? getProfitColor(holding.unrealizedGain) : 'text.secondary',
                },
                {
                  label: '수익률',
                  value: formatRate(holding.profitRate),
                  color: getProfitColor(holding.profitRate),
                },
              ].map((item, idx) => (
                <Box
                  key={item.label}
                  sx={{
                    px: 2,
                    py: 1.75,
                    borderLeft: idx > 0 ? '1px solid #c8e6c9' : 'none',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Card elevation={0}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              label="종목명"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
              size="small"
            />

            <TextField
              label="티커 (선택)"
              value={form.ticker}
              onChange={(e) => handleChange('ticker', e.target.value)}
              fullWidth
              size="small"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="자산 유형"
                value={form.assetTypeCode}
                onChange={(e) => handleChange('assetTypeCode', e.target.value)}
                required
                fullWidth
                size="small"
              >
                {assetTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="통화"
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                required
                fullWidth
                size="small"
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="매수 평균가"
                value={form.averageBuyPrice}
                onChange={(e) => handleChange('averageBuyPrice', e.target.value)}
                required
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
                slotProps={{
                  input: {
                    startAdornment: currencySymbol ? (
                      <InputAdornment position="start">{currencySymbol}</InputAdornment>
                    ) : undefined,
                  },
                }}
              />

              <TextField
                label="수량"
                value={form.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
                fullWidth
                size="small"
                type="number"
                inputProps={{ min: 0, step: 'any' }}
              />
            </Box>

            <TextField
              label="현재가 (선택)"
              value={form.currentPrice}
              onChange={(e) => handleChange('currentPrice', e.target.value)}
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 0, step: 'any' }}
              slotProps={{
                input: {
                  startAdornment: currencySymbol ? (
                    <InputAdornment position="start">{currencySymbol}</InputAdornment>
                  ) : undefined,
                },
              }}
              helperText="입력하지 않으면 수익률이 계산되지 않습니다."
            />

            <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => router.push(`/accounts/${id}`)}
                fullWidth
                sx={{ borderColor: 'divider', color: 'text.secondary' }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || saving}
                fullWidth
              >
                저장
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'divider' }} />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              종목을 삭제하면 해당 종목의 모든 데이터가 삭제됩니다.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDelete}
              disabled={deleting}
            >
              종목 삭제
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
