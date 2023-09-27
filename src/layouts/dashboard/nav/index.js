import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Switch, useLocation, useParams, NavLink, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {
  Handyman,
  PublishedWithChanges,
  QueryBuilder,
  Inventory,
  Summarize,
  AccountCircle,
  LocalShipping,
  Paid,
  Engineering,
} from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../../../context/AuthContext';
import { useMyContext } from '../../../context/PageContext';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const dataUser = JSON.parse(localStorage.getItem('dataUser'));
  const { authUser } = useAuth();
  const userRole = dataUser?.roles;
  console.log(authUser);
  const { id } = useParams();
  const [savedTitle, setSavedTitle] = useState('');
  useEffect(() => {
    const routeTitleMap = {
      '/dashboard/app': 'List Project',
      '/dashboard/Application': 'Progress Project',
      '/dashboard/Supplier': 'List Supplier',
      '/dashboard/stock': 'List Stock',
      '/Dashboard/AddApplication': 'Pengajuan Project Baru',
      '/dashboard/User': 'List User',
      '/dashboard/pembayaran': 'Pembayaran Upah',
      '/dashboard/Tukang': 'List Tukang',
    };
    routeTitleMap[`/dashboard/Requester/${id}`] = `Pengajuan Lembur dari #${id}`;
    routeTitleMap[`/Dashboard/Approver/${id}`] = `Buat Pengajuan Lembur dari #${id}`;
    routeTitleMap[`/dashboard/ListLembur/${id}`] = `Lembur dari #${id}`;
    const path = location.pathname;
    const newTitle = routeTitleMap[path] || 'Default Title';
    console.log(location);
    setSavedTitle(newTitle);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('dataUser');
    navigate('/login');
  };
  const adminNavItems = (
    <>
      <NavLink to="/dashboard/app" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <Handyman />
          </ListItemIcon>
          <ListItemText primary="List Project" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/dashboard/Application" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <PublishedWithChanges />
          </ListItemIcon>
          <ListItemText primary="Progress Project" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/dashboard/pembayaran" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText primary="Pembayaran Upah" />
        </ListItemButton>
      </NavLink>
      {/* <NavLink to="/dashboard/Application" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <QueryBuilder />
          </ListItemIcon>
          <ListItemText primary="Absensi" />
        </ListItemButton>
      </NavLink> */}
      <NavLink to="/dashboard/Tukang" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <Engineering />
          </ListItemIcon>
          <ListItemText primary="List Tukang" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/dashboard/Supplier" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="List Supplier" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/dashboard/stock" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="List Stock" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/dashboard/User" style={{ textDecoration: 'none', color: '#000' }}>
        <ListItemButton>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="User" />
        </ListItemButton>
      </NavLink>
    </>
  );

  // const approverNavItems = (
  //   <>
  //     <ListItemButton LinkComponent={'link'} to="/dashboard/app">
  //       <ListItemIcon>
  //         <DashboardIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Staff" />
  //     </ListItemButton>
  //     <ListItemButton LinkComponent={'link'} to="/dashboard/products">
  //       <ListItemIcon>
  //         <AssignmentIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Pengajuan Lembur" />
  //     </ListItemButton>
  //   </>
  // );
  // const requesterNavItems = (
  //   <>
  //     <ListItemButton LinkComponent={'link'} to="/dashboard/app">
  //       <ListItemIcon>
  //         <DashboardIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Staff" />
  //     </ListItemButton>
  //     <ListItemButton LinkComponent={'link'} to="/dashboard/products">
  //       <ListItemIcon>
  //         <AssignmentIcon />
  //       </ListItemIcon>
  //       <ListItemText primary="Pengajuan Lembur" />
  //     </ListItemButton>
  //   </>
  // );

  const renderNavItems = () => {
    switch (userRole) {
      case 'Admin':
        return adminNavItems;
      // case 'approver':
      //   return approverNavItems;
      // case 'requester':
      //   return requesterNavItems;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} style={{ backgroundColor: '#bc251a' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              {savedTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              pl: [2],
              py: [1],
            }}
            component={'div'}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                px: [0],
                py: [1],
              }}
            >
              <Typography component="h1" variant="h6" color="inherit">
                {dataUser.nama_lengkap}
              </Typography>
              {open ? (
                <Typography component="h1" variant="h6" color="inherit">
                  {dataUser.roles}
                </Typography>
              ) : null}
            </Box>
            <Box
              sx={{
                display: 'flex',
                pr: [2],
                py: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider />
          <List component="nav">{renderNavItems()}</List>
          <Box sx={{ position: 'absolute', bottom: '16px', left: '2px', width: 235, overflow: 'hidden' }}>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
