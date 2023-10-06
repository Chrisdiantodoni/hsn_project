import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 30,
  paddingRight: 20,
  paddingLeft: 20,
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main open={open}>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
