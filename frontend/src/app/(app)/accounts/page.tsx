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
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { formatKrw, formatRate, getProfitColor } from '@/shared/lib/format';
import { MOCK_ACCOUNTS } from '@/shared/mock';
import { INSTITUTION_LABELS, ACCOUNT_TYPE_LABELS } from '@/shared/types';

export default function AccountsPage() {
  const router = useRouter();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">계좌</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/accounts/new')}
        >
          계좌 추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {MOCK_ACCOUNTS.map((account) => {
          const gain = account.currentValueKrw - account.principalKrw;
          const isProfit = gain > 0;

          return (
            <Card key={account.id} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardActionArea
                onClick={() => router.push(`/accounts/${account.id}`)}
                sx={{ borderRadius: 'inherit' }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <AccountBalanceIcon sx={{ color: '#fff', fontSize: 22 }} />
                      </Box>
                      <Box>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {INSTITUTION_LABELS[account.institution]}
                          </Typography>
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

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatKrw(account.currentValueKrw)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 0.5,
                        }}
                      >
                        {isProfit ? (
                          <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: getProfitColor(account.profitRate) }}
                        >
                          {formatRate(account.profitRate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        투자 원금
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatKrw(account.principalKrw)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        평가 손익
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: getProfitColor(gain) }}
                      >
                        {gain > 0 ? '+' : ''}
                        {formatKrw(gain)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        보유 종목
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {account.holdingsCount}개
                      </Typography>
                    </Box>
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
