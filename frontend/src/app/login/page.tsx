import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4">
        로그인
      </Typography>
    </Box>
  );
}
