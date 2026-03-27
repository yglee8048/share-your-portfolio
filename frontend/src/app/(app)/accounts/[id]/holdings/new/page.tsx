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
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { MOCK_ACCOUNTS } from '@/shared/mock';
import type { AssetType, Currency, CreateHoldingForm } from '@/shared/types';
import {
  ASSET_TYPE_LABELS,
  CURRENCY_SYMBOLS,
  INSTITUTION_LABELS,
  ACCOUNT_TYPE_LABELS,
} from '@/shared/types';

const ASSET_TYPES = Object.keys(ASSET_TYPE_LABELS) as AssetType[];
const CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY', 'EUR', 'GBP', 'CNY', 'HKD'];

const INITIAL_FORM: CreateHoldingForm = {
  name: '',
  ticker: '',
  assetType: '',
  currency: '',
  averageBuyPrice: '',
  quantity: '',
  currentPrice: '',
  tags: '',
};

export default function NewHoldingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<CreateHoldingForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const account = MOCK_ACCOUNTS.find((a) => a.id === id);

  function handleChange(field: keyof CreateHoldingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: await api.post(`/api/accounts/${id}/holdings`, { ... });
      console.log('종목 추가:', form);
      router.push(`/accounts/${id}`);
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    form.name.trim() && form.assetType && form.currency && form.averageBuyPrice && form.quantity;

  const currencySymbol = form.currency ? CURRENCY_SYMBOLS[form.currency as Currency] : '';

  const accountLabel = account
    ? `${INSTITUTION_LABELS[account.institution]} ${ACCOUNT_TYPE_LABELS[account.accountType]}`
    : id;

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
          종목 추가
        </Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ mb: 3 }}>
        종목 추가
      </Typography>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
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
              placeholder="예) 삼성전자, Apple"
            />

            <TextField
              label="티커 (선택)"
              value={form.ticker}
              onChange={(e) => handleChange('ticker', e.target.value)}
              fullWidth
              size="small"
              placeholder="예) 005930, AAPL"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="자산 유형"
                value={form.assetType}
                onChange={(e) => handleChange('assetType', e.target.value)}
                required
                fullWidth
                size="small"
              >
                {ASSET_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {ASSET_TYPE_LABELS[type]}
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

            <TextField
              label="태그 (선택)"
              value={form.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              fullWidth
              size="small"
              placeholder="예) 반도체, 코어, AI (쉼표로 구분)"
              helperText="쉼표(,)로 구분하여 여러 태그를 입력할 수 있습니다."
            />

            <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
              <Button variant="outlined" onClick={() => router.push(`/accounts/${id}`)} fullWidth>
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || loading}
                fullWidth
              >
                저장
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
