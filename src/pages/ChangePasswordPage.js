import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import { ChangePasswordForm } from '../sections/auth/login';
import useResponsive from '../hooks/useResponsive';
// components
import Iconify from '../components/iconify';
// sections
import Image from '../Assets/Cross lines.png';
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

console.log(process.env.NODE_ENV);
export default function ChangePasswordPage() {
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
            <Typography variant="h4" gutterBottom align="center" color={'#000'}>
              Aksi Perubahan Password Diperlukan
              {process.env.REACT_APP_ENV}
            </Typography>

            <ChangePasswordForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
