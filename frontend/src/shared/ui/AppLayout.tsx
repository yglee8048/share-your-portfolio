'use client';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 224;

const topNavItems = [
  { label: '계좌', href: '/accounts' },
];

const bottomNavItems = [
  { label: '계좌', href: '/accounts', icon: <AccountBalanceIcon /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const bottomNavValue = bottomNavItems.findIndex(
    (item) => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href)),
  );

  function isNavActive(href: string) {
    return href === pathname || (href !== '/' && pathname.startsWith(href));
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 상단 AppBar — 항상 표시 */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          // Mobile: 다크 / Desktop: 글래스모피즘 라이트
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, md: 64 } }}>
          {/* Mobile: 햄버거 메뉴 */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 1.5, display: { md: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* 브랜드 */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontFamily: '"Manrope", sans-serif',
              fontSize: '1.1rem',
              color: 'primary.dark',
              mr: { md: 4 },
            }}
          >
            포트폴리오
          </Typography>

          {/* Desktop 수평 Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'stretch', flexGrow: 1 }}>
            {topNavItems.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  disableRipple={false}
                  sx={{
                    px: 2,
                    borderRadius: 0,
                    minHeight: 64,
                    color: active ? 'primary.main' : 'text.secondary',
                    fontWeight: active ? 700 : 400,
                    fontSize: '0.875rem',
                    letterSpacing: 0,
                    borderBottom: active ? '2px solid' : '2px solid transparent',
                    borderColor: active ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(67,160,71,0.07)',
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          {/* 아바타 */}
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              fontSize: '0.65rem',
              fontWeight: 700,
              fontFamily: '"Manrope", sans-serif',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'primary.light' },
            }}
          >
            M+J
          </Avatar>
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
        {/* AppBar 높이만큼 공간 */}
        <Toolbar sx={{ minHeight: '64px !important' }} />
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
          p: { xs: 2.5, md: 4 },
          mt: { xs: 7, md: 8 },
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
            bgcolor: 'background.paper',
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction key={item.href} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}
