'use client';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link as MuiLink,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useAccount } from '@/features/account/hooks';
import { formatKrw, formatAmount, formatRate, getProfitColor } from '@/shared/lib/format';
import { CURRENCY_SYMBOLS } from '@/shared/types';

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { account, holdings } = useAccount(id);

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

  const gain = account.currentValueKrw - account.principalKrw;
  const isProfit = gain >= 0;

  return (
    <Box sx={{ maxWidth: 1080, mx: 'auto' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <MuiLink
          underline="hover"
          color="text.secondary"
          onClick={() => router.push('/accounts')}
          sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
        >
          계좌
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
          {account.nickName}
        </Typography>
      </Breadcrumbs>

      {/* 계좌 요약 카드 */}
      <Card elevation={0} sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* 헤더 행 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
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
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/accounts/${id}/edit`)}
              sx={{ borderColor: 'divider', color: 'text.secondary', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
            >
              계좌 수정
            </Button>
          </Box>

          {/* 수치 그리드 */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 0,
              bgcolor: '#e8f5e9',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {[
              {
                label: '총 평가액',
                value: formatKrw(account.currentValueKrw),
                hero: true,
                color: 'text.primary',
              },
              {
                label: '투자 원금',
                value: formatKrw(account.principalKrw),
                color: 'text.primary',
              },
              {
                label: '평가 손익',
                value: `${gain > 0 ? '+' : ''}${formatKrw(gain)}`,
                color: getProfitColor(gain),
              },
              {
                label: '수익률',
                value: formatRate(account.profitRate),
                color: getProfitColor(account.profitRate),
              },
            ].map((item, idx) => (
              <Box
                key={item.label}
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 2,
                  borderLeft: idx > 0 ? '1px solid #c8e6c9' : 'none',
                  borderBottom: { xs: idx < 2 ? '1px solid #c8e6c9' : 'none', md: 'none' },
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", "Pretendard", sans-serif',
                    fontWeight: item.hero ? 800 : 700,
                    fontSize: item.hero ? { xs: '1.1rem', md: '1.4rem' } : { xs: '0.95rem', md: '1.1rem' },
                    letterSpacing: '-0.02em',
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

      {/* 종목 섹션 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            보유 종목
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {holdings.length}개 종목
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => router.push(`/accounts/${id}/holdings/new`)}
        >
          종목 추가
        </Button>
      </Box>

      {/* 종목 테이블 */}
      <Card elevation={0}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>종목</TableCell>
                <TableCell>유형</TableCell>
                <TableCell align="right">매수 평균가</TableCell>
                <TableCell align="right">현재가</TableCell>
                <TableCell align="right">수량</TableCell>
                <TableCell align="right">원금</TableCell>
                <TableCell align="right">현재 가치</TableCell>
                <TableCell align="right">수익률</TableCell>
                <TableCell align="right">평가 손익</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {holding.asset.name}
                      </Typography>
                      {holding.asset.ticker && (
                        <Typography variant="caption" color="text.secondary">
                          {holding.asset.ticker}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {holding.assetType.label}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 500 }}>
                      {CURRENCY_SYMBOLS[holding.currency]}
                      {holding.averageBuyPrice.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {holding.currentPrice != null ? (
                      <Typography variant="body2" sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 500 }}>
                        {CURRENCY_SYMBOLS[holding.currency]}
                        {holding.currentPrice.toLocaleString()}
                      </Typography>
                    ) : (
                      <Tooltip title="현재가 미입력">
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{holding.quantity.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{formatAmount(holding.principalAmount, holding.currency)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {holding.currentValue != null ? (
                      <Typography variant="body2">{formatAmount(holding.currentValue, holding.currency)}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {holding.profitRate != null ? (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: getProfitColor(holding.profitRate) }}
                      >
                        {formatRate(holding.profitRate)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {holding.unrealizedGain != null ? (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: getProfitColor(holding.unrealizedGain) }}
                      >
                        {holding.unrealizedGain > 0 ? '+' : ''}
                        {formatAmount(holding.unrealizedGain, holding.currency)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ width: 36, px: 1 }}>
                    <Tooltip title="종목 수정">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/accounts/${id}/holdings/${holding.id}/edit`)}
                        sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {holdings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.disabled" variant="body2">
                      보유 종목이 없습니다. 종목을 추가해보세요.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
