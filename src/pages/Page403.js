import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// import Forbidden from '../Assets/Forbidden.png';

// ----------------------------------------------------------------------

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

export default function Page403() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Authorized </title>
      </Helmet>
      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not Authorized!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, you are not Authorized. Perhaps you’ve mistyped the URL? Be sure to check your spelling.
          </Typography>

          {/* <Box component="img" src={Forbidden} sx={{ height: 'auto', mx: 'auto', my: { xs: 5, sm: 10 } }} /> */}

          <Button to="/" size="large" variant="contained" color="color" component={RouterLink}>
            Go to Login
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
