'use client';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddIcon from '@mui/icons-material/Add';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAccounts } from '@/features/account/hooks';
import { getTotalAssetsKrw, getTotalPrincipalKrw } from '@/shared/mock';
import { formatKrw, formatRate, getProfitColor } from '@/shared/lib/format';

export default function AccountsPage() {
  const router = useRouter();
  const { accounts } = useAccounts();

  const totalAssets = getTotalAssetsKrw(accounts);
  const totalPrincipal = getTotalPrincipalKrw(accounts);
  const totalGain = totalAssets - totalPrincipal;
  const totalRate = totalPrincipal > 0 ? (totalGain / totalPrincipal) * 100 : 0;
  const isProfit = totalGain >= 0;

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            내 포트폴리오
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            계좌
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/accounts/new')}
          sx={{ mt: 0.5 }}
        >
          계좌 추가
        </Button>
      </Box>

      {/* 총 자산 히어로 카드 */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 55%, #66bb6a 100%)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 배경 장식 원 */}
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            right: 80,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }}
        />
        <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            총 평가 자산
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Manrope", "Pretendard", sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.75rem' },
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            {formatKrw(totalAssets)}
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 }, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.25 }}>
                투자 원금
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                {formatKrw(totalPrincipal)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.25 }}>
                평가 손익
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isProfit ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: '#a3f69c' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: '#ffdad6' }} />
                )}
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: isProfit ? '#a3f69c' : '#ffdad6',
                  }}
                >
                  {totalGain > 0 ? '+' : ''}
                  {formatKrw(totalGain)}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.25 }}>
                수익률
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: isProfit ? '#a3f69c' : '#ffdad6',
                }}
              >
                {formatRate(totalRate)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.25 }}>
                계좌 수
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                {accounts.length}개
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 계좌 목록 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {accounts.map((account) => {
          const gain = account.currentValueKrw - account.principalKrw;
          const accountIsProfit = gain >= 0;

          return (
            <Card key={account.id} elevation={0}>
              <CardActionArea
                onClick={() => router.push(`/accounts/${account.id}`)}
                sx={{ borderRadius: 'inherit' }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    {/* 왼쪽: 계좌 정보 */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #43a047, #66bb6a)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <AccountBalanceIcon sx={{ color: '#fff', fontSize: 22 }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            {account.nickName}
                          </Typography>
                          <Chip
                            label={account.accountType.label}
                            size="small"
                            sx={{
                              fontSize: '0.65rem',
                              height: 18,
                              bgcolor: 'rgba(67,160,71,0.12)',
                              color: 'primary.main',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {account.institution.label} · {account.accountNumber}
                        </Typography>
                      </Box>
                    </Box>

                    {/* 오른쪽: 평가금액 + 수익률 */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        sx={{
                          fontFamily: '"Manrope", "Pretendard", sans-serif',
                          fontWeight: 800,
                          fontSize: '1.25rem',
                          letterSpacing: '-0.02em',
                          color: 'text.primary',
                        }}
                      >
                        {formatKrw(account.currentValueKrw)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.25 }}>
                        {accountIsProfit ? (
                          <TrendingUpIcon sx={{ fontSize: 13, color: 'secondary.main' }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 13, color: 'error.main' }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: getProfitColor(account.profitRate) }}
                        >
                          {formatRate(account.profitRate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* 하단 메트릭 */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0,
                      bgcolor: '#e8f5e9',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {[
                      { label: '투자 원금', value: formatKrw(account.principalKrw) },
                      {
                        label: '평가 손익',
                        value: `${gain > 0 ? '+' : ''}${formatKrw(gain)}`,
                        color: getProfitColor(gain),
                      },
                      { label: '보유 종목', value: `${account.holdingsCount}개` },
                    ].map((metric, idx) => (
                      <Box
                        key={metric.label}
                        sx={{
                          flex: 1,
                          px: 2,
                          py: 1.5,
                          borderLeft: idx > 0 ? '1px solid #c8e6c9' : 'none',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                          {metric.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: metric.color ?? 'text.primary' }}
                        >
                          {metric.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
