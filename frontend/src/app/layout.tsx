import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from 'next';
import ThemeRegistry from '@/shared/ui/ThemeRegistry';

export const metadata: Metadata = {
  title: '자산 포트폴리오',
  description: '부부가 함께 자산을 관리하는 포트폴리오 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
