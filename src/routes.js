import { useEffect } from 'react';
import { Navigate, useRoutes, createBrowserRouter, useNavigate, redirect } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import Supplier from './pages/Supplier';
import UserList from './pages/User/UserList';
import ProjectPage from './pages/ProjectPage';
import Stock from './pages/Stock/Stock';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AddNewApplication from './pages/application/AddNewApplication';

import Page403 from './pages/Page403';
import Tukang from './pages/Tukang/Tukang';

function PrivateRoute({ element, allowedRoles }) {
  const dataUser = JSON.parse(localStorage.getItem('dataUser'));
  const userRole = dataUser?.roles;
  const authenticated = !!userRole;
  console.log(authenticated, userRole);
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return element;
}

export default function Router() {
  const dataUser = JSON.parse(localStorage.getItem('dataUser'));
  const userRole = dataUser?.roles;
  const authenticated = !!userRole;
  console.log(authenticated, userRole);

  const routes = useRoutes([
    {
      path: '/',
      element: authenticated ? <Navigate to="/dashboard/app" replace /> : <Navigate to="/login" replace />,
    },
    {
      path: '/login',
      element: authenticated ? <Navigate to="/dashboard/app" replace /> : <LoginPage />,
    },
    {
      path: '/changepassword',
      element: <ChangePasswordPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <ProjectPage /> },
        // { path: 'Application', element: <PengajuanLembur /> },
        {
          path: 'AddApplication',
          element: <PrivateRoute element={<AddNewApplication />} allowedRoles={['Admin', 'Requester']} />,
        },
        // {
        //   path: 'Approver/:id',
        //   element: (
        //     <PrivateRoute path="/dashboard/Approver/:id" element={<Approver />} allowedRoles={['Admin', 'Approver']} />
        //   ),
        // },
        // {
        //   path: 'Requester/:id',
        //   element: (
        //     <PrivateRoute
        //       path="/dashboard/Requester/:id"
        //       element={<Requester />}
        //       allowedRoles={['Admin', 'Requester']}
        //     />
        //   ),
        // },
        { path: 'Supplier', element: <Supplier /> },
        { path: 'User', element: <UserList /> },
        { path: 'stock', element: <Stock /> },
        { path: 'tukang', element: <Tukang /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: authenticated ? <Navigate to="/dashboard/app" replace /> : <Navigate to="/login" replace /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
