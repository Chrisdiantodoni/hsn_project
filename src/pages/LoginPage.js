import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
// sections
import { LoginForm } from '../sections/auth/login';
import Image from '../Assets/HOKITO.png';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  overflow: 'hidden',
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <img
              src={Image}
              alt="login"
              style={{ width: '186px', height: '186px', marginBottom: '45px', alignSelf: 'center' }}
            />

            <Typography variant="h5" gutterBottom align="center" color={'#000'}>
              SISTEM PENGAJUAN PROYEK
            </Typography>
            <LoginForm />
            <Box component={'div'} display={'flex'} justifyContent={'flex-end'}>
              <Link to={'/changepassword'} style={{ textDecorationStyle: 'none', color: '#000000' }}>
                <Typography>Lupa Password?</Typography>
              </Link>
            </Box>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
