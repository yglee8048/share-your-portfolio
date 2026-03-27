'use client';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: '대시보드', href: '/', icon: <DashboardIcon fontSize="small" /> },
  { label: '계좌', href: '/accounts', icon: <AccountBalanceIcon fontSize="small" /> },
];

const disabledItems = [
  { label: '포트폴리오', href: '/portfolio', icon: <PieChartIcon fontSize="small" />, badge: 'Sprint 2' },
  { label: '투자 일지', href: '/journal', icon: <BookIcon fontSize="small" />, badge: 'Sprint 3' },
  { label: '성과', href: '/performance', icon: <BarChartIcon fontSize="small" />, badge: 'Sprint 5' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 2,
                  color: isActive ? '#fff' : 'rgba(241,245,249,0.7)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(37,99,235,0.85)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(37,99,235,0.95)' },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2, my: 1 }} />

      <List sx={{ px: 1, flexGrow: 1 }}>
        {disabledItems.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              disabled
              sx={{
                borderRadius: 2,
                opacity: 0.4,
                color: 'rgba(241,245,249,0.5)',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontSize: '0.875rem' } }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(241,245,249,0.4)', fontSize: '0.65rem' }}>
                {item.badge}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List sx={{ px: 1, pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={pathname === '/settings'}
            onClick={() => router.push('/settings')}
            sx={{
              borderRadius: 2,
              color: pathname === '/settings' ? '#fff' : 'rgba(241,245,249,0.7)',
              '&.Mui-selected': {
                backgroundColor: 'rgba(37,99,235,0.85)',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(37,99,235,0.95)' },
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#fff',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="설정"
              slotProps={{ primary: { fontSize: '0.875rem', fontWeight: pathname === '/settings' ? 600 : 400 } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
