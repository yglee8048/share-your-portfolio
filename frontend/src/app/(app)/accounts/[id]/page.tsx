'use client';

import AddIcon from '@mui/icons-material/Add';
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
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { formatKrw, formatAmount, formatRate, getProfitColor } from '@/shared/lib/format';
import { MOCK_ACCOUNTS, MOCK_HOLDINGS } from '@/shared/mock';
import {
  INSTITUTION_LABELS,
  ACCOUNT_TYPE_LABELS,
  ASSET_TYPE_LABELS,
  CURRENCY_SYMBOLS,
} from '@/shared/types';

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const account = MOCK_ACCOUNTS.find((a) => a.id === id);
  const holdings = MOCK_HOLDINGS[id] ?? [];

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

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
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
          {INSTITUTION_LABELS[account.institution]} {ACCOUNT_TYPE_LABELS[account.accountType]}
        </Typography>
      </Breadcrumbs>

      {/* 계좌 요약 */}
      <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6">{INSTITUTION_LABELS[account.institution]}</Typography>
                <Chip
                  label={ACCOUNT_TYPE_LABELS[account.accountType]}
                  size="small"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {account.accountNumber}
                {account.memo && ` · ${account.memo}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 4, mt: 2.5, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                총 평가액
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatKrw(account.currentValueKrw)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                투자 원금
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatKrw(account.principalKrw)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                평가 손익
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: getProfitColor(gain) }}>
                {gain > 0 ? '+' : ''}
                {formatKrw(gain)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                수익률
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: getProfitColor(account.profitRate) }}
              >
                {formatRate(account.profitRate)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 종목 섹션 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">보유 종목 ({holdings.length})</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => router.push(`/accounts/${id}/holdings/new`)}
        >
          종목 추가
        </Button>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>종목</TableCell>
                <TableCell>자산 유형</TableCell>
                <TableCell align="right">매수 평균가</TableCell>
                <TableCell align="right">현재가</TableCell>
                <TableCell align="right">수량</TableCell>
                <TableCell align="right">원금</TableCell>
                <TableCell align="right">현재 가치</TableCell>
                <TableCell align="right">수익률</TableCell>
                <TableCell align="right">평가 손익</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.id} hover sx={{ '&:last-child td': { border: 0 } }}>
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
                      {holding.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          {holding.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                fontSize: '0.6rem',
                                height: 16,
                                '& .MuiChip-label': { px: 0.75 },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {ASSET_TYPE_LABELS[holding.assetType]}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {CURRENCY_SYMBOLS[holding.currency]}
                      {holding.averageBuyPrice.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {holding.currentPrice != null ? (
                      <Typography variant="body2">
                        {CURRENCY_SYMBOLS[holding.currency]}
                        {holding.currentPrice.toLocaleString()}
                      </Typography>
                    ) : (
                      <Tooltip title="현재가 미입력">
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{holding.quantity.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatAmount(holding.principalAmount, holding.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {holding.currentValue != null ? (
                      <Typography variant="body2">
                        {formatAmount(holding.currentValue, holding.currency)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {holding.profitRate != null ? (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: getProfitColor(holding.profitRate) }}
                      >
                        {formatRate(holding.profitRate)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {holding.unrealizedGain != null ? (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: getProfitColor(holding.unrealizedGain) }}
                      >
                        {holding.unrealizedGain > 0 ? '+' : ''}
                        {formatAmount(holding.unrealizedGain, holding.currency)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {holdings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="body2">
                      보유 종목이 없습니다.
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
