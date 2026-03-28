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
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { useAccount, useUpdateAccount, useDeleteAccount } from '@/features/account/hooks';
import { useInstitutions, useAccountTypes } from '@/features/meta/hooks';
import type { Currency, UpdateAccountForm } from '@/shared/types';

const CURRENCIES: Currency[] = ['KRW', 'USD', 'JPY', 'EUR', 'GBP', 'CNY', 'HKD'];

export default function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { account } = useAccount(id);
  const { updateAccount, loading: saving } = useUpdateAccount();
  const { deleteAccount, loading: deleting } = useDeleteAccount();
  const { institutions } = useInstitutions();
  const { accountTypes } = useAccountTypes();

  const [form, setForm] = useState<UpdateAccountForm | null>(null);

  // 계좌 로드 후 초기값 설정 (한 번만)
  if (account && form === null) {
    setForm({
      institutionCode: account.institution.code,
      accountNumber: account.accountNumber,
      accountTypeCode: account.accountType.code,
      currency: account.currency,
      nickName: account.nickName,
    });
  }

  if (!account) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          계좌를 찾을 수 없습니다.
        </Typography>
        <Button onClick={() => router.push('/accounts')} sx={{ mt: 2 }}>
          계좌 목록으로
        </Button>
      </Box>
    );
  }

  if (!form) return null;

  function handleChange(field: keyof UpdateAccountForm, value: string) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    await updateAccount(id, form);
    router.push(`/accounts/${id}`);
  }

  async function handleDelete() {
    if (!confirm('계좌를 삭제하시겠습니까? 보유 종목도 함께 삭제됩니다.')) return;
    await deleteAccount(id);
    router.push('/accounts');
  }

  const isValid =
    form.institutionCode &&
    form.accountNumber.trim() &&
    form.accountTypeCode &&
    form.currency &&
    form.nickName.trim();
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
          계좌 수정
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {accountLabel}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          계좌 수정
        </Typography>
      </Box>

      <Card elevation={0}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              select
              label="금융 기관"
              value={form.institutionCode}
              onChange={(e) => handleChange('institutionCode', e.target.value)}
              required
              fullWidth
              size="small"
            >
              {institutions.map((inst) => (
                <MenuItem key={inst.code} value={inst.code}>
                  {inst.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="계좌 유형"
                value={form.accountTypeCode}
                onChange={(e) => handleChange('accountTypeCode', e.target.value)}
                required
                fullWidth
                size="small"
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="기준 통화"
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

            <TextField
              label="계좌번호"
              value={form.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              required
              fullWidth
              size="small"
              placeholder="예) 1234-5678-9012"
            />

            <TextField
              label="별칭"
              value={form.nickName}
              onChange={(e) => handleChange('nickName', e.target.value)}
              required
              fullWidth
              size="small"
              placeholder="예) 주식 + ETF 위주"
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
              계좌를 삭제하면 보유 종목 데이터도 함께 삭제됩니다.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDelete}
              disabled={deleting}
            >
              계좌 삭제
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
