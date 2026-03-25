import Typography from '@mui/material/Typography';
import AppLayout from '@/components/layout/AppLayout';

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppLayout>
      <Typography variant="h4" gutterBottom>
        계좌 상세
      </Typography>
      <Typography variant="body1" color="text.secondary">
        계좌 ID: {id} — Sprint 1에서 구현 예정
      </Typography>
    </AppLayout>
  );
}
