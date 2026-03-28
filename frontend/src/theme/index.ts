import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#43a047',      // Green 600 — 기존 #0d631b 보다 밝은 파스텔 그린
      light: '#76d275',     // Green 400
      dark: '#2e7d32',      // Green 700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#005faf',      // 양수 수익률 (한국 금융 컨벤션 — 상승=파랑)
      light: '#d4e3ff',
      dark: '#003567',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ac0c18',      // 음수 수익률 (하락=빨강)
      light: '#ffdad6',
    },
    success: {
      main: '#43a047',
      light: '#c8e6c9',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c2b1c',   // 그린 틴트 다크
      secondary: '#4a6e4a', // 그린 틴트 미디엄
      disabled: '#90a890',
    },
    divider: '#c8e6c9',     // Green 100
  },
  typography: {
    fontFamily: '"Pretendard", "Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Manrope", "Pretendard", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Manrope", "Pretendard", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Manrope", "Pretendard", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Manrope", "Pretendard", sans-serif', fontWeight: 800 },
    h5: { fontFamily: '"Manrope", "Pretendard", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Manrope", "Pretendard", sans-serif', fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(67,160,71,0.08)',
          borderRadius: 16,
          border: '1px solid #c8e6c9',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          '&.Mui-disabled': {
            background: '#e0e0e0',
            color: '#9e9e9e',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)',
            color: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
              color: '#ffffff',
            },
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: 999 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c8e6c9',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#43a047',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#43a047',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#4a6e4a',
          '&.Mui-focused': { color: '#43a047' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#4a6e4a',
          fontSize: '0.75rem',
          letterSpacing: '0.02em',
          backgroundColor: '#e8f5e9',   // Green 50
          borderBottom: '1px solid #c8e6c9',
        },
        body: {
          borderBottom: '1px solid #e8f5e9',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#e8f5e9',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#1c2b1c',
          borderRight: '1px solid #c8e6c9',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#c8e6c9',
        },
      },
    },
  },
});

export default theme;
