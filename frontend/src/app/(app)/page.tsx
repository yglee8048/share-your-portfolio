'use client';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { formatKrw, formatRate, getProfitColor } from '@/shared/lib/format';
import { MOCK_ACCOUNTS, MOCK_EXCHANGE_RATES, getTotalAssetsKrw, getTotalPrincipalKrw } from '@/shared/mock';
import { INSTITUTION_LABELS, ACCOUNT_TYPE_LABELS } from '@/shared/types';

export default function DashboardPage() {
  const router = useRouter();

  const totalKrw = useMemo(() => getTotalAssetsKrw(MOCK_ACCOUNTS), []);
  const totalPrincipal = useMemo(() => getTotalPrincipalKrw(MOCK_ACCOUNTS), []);
  const totalGain = totalKrw - totalPrincipal;
  const totalRate = (totalGain / totalPrincipal) * 100;

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        대시보드
      </Typography>

      {/* 총 자산 히어로 카드 */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 100%)',
          color: '#fff',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            총 자산 (KRW 기준)
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.03em', mb: 2 }}>
            {formatKrw(totalKrw)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>
                투자 원금
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatKrw(totalPrincipal)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>
                평가 손익
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {totalGain > 0 ? (
                  <TrendingUpIcon fontSize="small" sx={{ color: '#86efac' }} />
                ) : (
                  <TrendingDownIcon fontSize="small" sx={{ color: '#fca5a5' }} />
                )}
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: totalGain > 0 ? '#86efac' : '#fca5a5' }}
                >
                  {totalGain > 0 ? '+' : ''}
                  {formatKrw(totalGain)} ({formatRate(totalRate)})
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 계좌별 요약 */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        계좌별 현황
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {MOCK_ACCOUNTS.map((account) => {
          const gain = account.currentValueKrw - account.principalKrw;
          return (
            <Grid key={account.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardActionArea
                  onClick={() => router.push(`/accounts/${account.id}`)}
                  sx={{ height: '100%', borderRadius: 'inherit' }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {INSTITUTION_LABELS[account.institution]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {account.accountNumber}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={ACCOUNT_TYPE_LABELS[account.accountType]}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {formatKrw(account.currentValueKrw)}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        원금 {formatKrw(account.principalKrw)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: getProfitColor(account.profitRate) }}
                      >
                        {formatRate(account.profitRate)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      종목 {account.holdingsCount}개 ·{' '}손익{' '}
                      <Box
                        component="span"
                        sx={{ color: getProfitColor(gain), fontWeight: 600 }}
                      >
                        {gain > 0 ? '+' : ''}
                        {formatKrw(gain)}
                      </Box>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 환율 현황 */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        환율 현황
      </Typography>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {MOCK_EXCHANGE_RATES.map((rate) => (
              <Box key={rate.currency}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {rate.currency} / KRW
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {rate.rateToKrw.toLocaleString('ko-KR')}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                    원
                  </Typography>
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            수동 입력 · 설정에서 변경 가능
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
