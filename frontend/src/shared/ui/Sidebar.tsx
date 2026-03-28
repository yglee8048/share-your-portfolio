'use client';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: '계좌', href: '/accounts', icon: <AccountBalanceIcon fontSize="small" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          메뉴
        </Typography>
      </Box>
      <List sx={{ px: 1.5, pt: 0 }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 2,
                  color: isActive ? 'primary.dark' : 'text.secondary',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(67,160,71,0.18)',
                    color: 'primary.dark',
                    '&:hover': { backgroundColor: 'rgba(67,160,71,0.26)' },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(67,160,71,0.08)',
                    color: 'primary.main',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      style: { fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
