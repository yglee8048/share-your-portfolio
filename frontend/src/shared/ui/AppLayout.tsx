'use client';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 220;

const bottomNavItems = [
  { label: '대시보드', href: '/', icon: <DashboardIcon /> },
  { label: '계좌', href: '/accounts', icon: <AccountBalanceIcon /> },
  { label: '설정', href: '/settings', icon: <SettingsIcon /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const bottomNavValue = bottomNavItems.findIndex(
    (item) => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href))
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 모바일 AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          display: { md: 'none' },
          backgroundColor: '#1e293b',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            포트폴리오
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 데스크탑 사이드바 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar sx={{ px: 2.5, minHeight: '64px !important' }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}
          >
            포트폴리오
          </Typography>
        </Toolbar>
        <Sidebar />
      </Drawer>

      {/* 모바일 드로어 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <Toolbar />
        <Sidebar />
      </Drawer>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: { xs: 8, md: 0 },
          mb: { xs: 7, md: 0 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>

      {/* 모바일 하단 탭 */}
      {isMobile && (
        <BottomNavigation
          value={bottomNavValue === -1 ? false : bottomNavValue}
          onChange={(_, newValue) => router.push(bottomNavItems[newValue].href)}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction
              key={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}
