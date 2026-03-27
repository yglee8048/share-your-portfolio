'use client';

import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useInvitations } from '@/features/auth/hooks';
import { useExchangeRates } from '@/features/market/hooks';
import { formatDate } from '@/shared/lib/format';
import { MOCK_EXCHANGE_RATES, MOCK_INVITATIONS } from '@/shared/mock';
import { FOREIGN_CURRENCIES } from '@/shared/types';
import type { Currency } from '@/shared/types';

const RATE_LABELS: Record<string, string> = {
  USD: '미국 달러 (USD)',
  JPY: '일본 엔 (JPY)',
  EUR: '유로 (EUR)',
  GBP: '영국 파운드 (GBP)',
  CNY: '중국 위안 (CNY)',
  HKD: '홍콩 달러 (HKD)',
};

export default function SettingsPage() {
  const { rates, rateInputs, setInput, save, savedCurrency } =
    useExchangeRates(MOCK_EXCHANGE_RATES);
  const { invitations, copiedCode, generate, remove, copy } = useInvitations(MOCK_INVITATIONS);

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        설정
      </Typography>

      {/* 환율 섹션 */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        환율
      </Typography>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            KRW 환산에 사용되는 환율을 수동으로 입력합니다.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FOREIGN_CURRENCIES.map((currency) => {
              const currentRate = rates.find((r) => r.currency === currency);
              const isSaved = savedCurrency === currency;

              return (
                <Box key={currency} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: 160, fontWeight: 500 }}>
                    {RATE_LABELS[currency]}
                  </Typography>
                  <TextField
                    value={rateInputs[currency] ?? ''}
                    onChange={(e) => setInput(currency, e.target.value)}
                    size="small"
                    type="number"
                    inputProps={{ min: 0, step: 'any' }}
                    sx={{ width: 140 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 0.5, whiteSpace: 'nowrap' }}
                          >
                            원
                          </Typography>
                        ),
                      },
                    }}
                  />
                  <Button
                    variant={isSaved ? 'outlined' : 'contained'}
                    size="small"
                    color={isSaved ? 'success' : 'primary'}
                    onClick={() => save(currency as Currency)}
                    sx={{ minWidth: 60 }}
                  >
                    {isSaved ? '저장됨' : '저장'}
                  </Button>
                  {currentRate && (
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(currentRate.updatedAt)} 기준
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* 초대 코드 섹션 */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Typography variant="subtitle1">초대 코드</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={generate}>
          코드 생성
        </Button>
      </Box>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            초대 코드를 공유하면 상대방이 회원가입할 수 있습니다. 사용된 코드는 재사용 불가합니다.
          </Typography>

          {invitations.length === 0 && (
            <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 2 }}>
              생성된 초대 코드가 없습니다.
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {invitations.map((inv, idx) => (
              <Box key={inv.code}>
                {idx > 0 && <Divider />}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: inv.status !== 'PENDING' ? 'text.disabled' : 'text.primary',
                      }}
                    >
                      {inv.code}
                    </Typography>
                    <Chip
                      label={
                        inv.status === 'PENDING' ? '대기' : inv.status === 'USED' ? '사용됨' : '만료'
                      }
                      size="small"
                      color={inv.status === 'PENDING' ? 'success' : 'default'}
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(inv.expiresAt)} 만료
                    </Typography>

                    {inv.status === 'PENDING' && (
                      <>
                        <Tooltip title={copiedCode === inv.code ? '복사됨!' : '코드 복사'}>
                          <IconButton
                            size="small"
                            onClick={() => copy(inv.code)}
                            color={copiedCode === inv.code ? 'success' : 'default'}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="코드 삭제">
                          <IconButton size="small" onClick={() => remove(inv.code)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
