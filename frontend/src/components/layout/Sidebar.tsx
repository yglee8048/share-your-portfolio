'use client';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PieChartIcon from '@mui/icons-material/PieChart';
import BookIcon from '@mui/icons-material/Book';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: '대시보드', href: '/', icon: <DashboardIcon /> },
  { label: '계좌', href: '/accounts', icon: <AccountBalanceIcon /> },
  { label: '포트폴리오', href: '/portfolio', icon: <PieChartIcon />, disabled: true },
  { label: '투자 일지', href: '/journal', icon: <BookIcon />, disabled: true },
  { label: '성과', href: '/performance', icon: <BarChartIcon />, disabled: true },
  { label: '설정', href: '/settings', icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <List>
      {navItems.map((item) => (
        <ListItem key={item.href} disablePadding>
          <ListItemButton
            selected={pathname === item.href}
            disabled={item.disabled}
            onClick={() => router.push(item.href)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
