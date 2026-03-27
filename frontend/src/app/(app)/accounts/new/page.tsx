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
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Institution, AccountType, CreateAccountForm } from '@/shared/types';
import { INSTITUTION_LABELS, ACCOUNT_TYPE_LABELS } from '@/shared/types';

const INSTITUTIONS = Object.keys(INSTITUTION_LABELS) as Institution[];
const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[];

const INITIAL_FORM: CreateAccountForm = {
  institution: '',
  accountNumber: '',
  accountType: '',
  memo: '',
};

export default function NewAccountPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateAccountForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof CreateAccountForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: await api.post('/api/accounts', form);
      console.log('계좌 생성:', form);
      router.push('/accounts');
    } finally {
      setLoading(false);
    }
  }

  const isValid = form.institution && form.accountNumber.trim() && form.accountType;

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
        <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
          계좌 추가
        </Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ mb: 3 }}>
        계좌 추가
      </Typography>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            <TextField
              select
              label="금융 기관"
              value={form.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
              required
              fullWidth
              size="small"
            >
              {INSTITUTIONS.map((inst) => (
                <MenuItem key={inst} value={inst}>
                  {INSTITUTION_LABELS[inst]}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="계좌 유형"
              value={form.accountType}
              onChange={(e) => handleChange('accountType', e.target.value)}
              required
              fullWidth
              size="small"
            >
              {ACCOUNT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {ACCOUNT_TYPE_LABELS[type]}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="계좌번호"
              value={form.accountNumber}
              onChange={(e) => handleChange('accountNumber', e.target.value)}
              required
              fullWidth
              size="small"
              placeholder="예) 1234-5678-9012"
              helperText="저장 시 뒷자리는 자동으로 마스킹됩니다."
            />

            <TextField
              label="메모 (선택)"
              value={form.memo}
              onChange={(e) => handleChange('memo', e.target.value)}
              fullWidth
              size="small"
              placeholder="예) 주식 + ETF 위주"
            />

            <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
              <Button variant="outlined" onClick={() => router.push('/accounts')} fullWidth>
                취소
              </Button>
              <Button type="submit" variant="contained" disabled={!isValid || loading} fullWidth>
                저장
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
