import Typography from '@mui/material/Typography';
import AppLayout from '@/components/layout/AppLayout';

export default function DashboardPage() {
  return (
    <AppLayout>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Sprint 1에서 구현 예정
      </Typography>
    </AppLayout>
  );
}
