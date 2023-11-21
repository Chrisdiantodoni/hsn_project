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
import DetailProject from './pages/Project/DetailProject';
import ProgressPage from './pages/Project/ProjectProgress';
import DetailProjectProgressDaily from './pages/Project/DetailProgressProjectDaily';
import DetailProjectProgressWeekly from './pages/Project/DetailProgressProjectWeekly';
import DetailPayWagesDaily from './pages/Project/DetailWagesDaily';
import DetailPayWagesWeekly from './pages/Project/DetailWagesWeekly';
import PayWagesPage from './pages/Project/PayWages';
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
  const dataUser = JSON.parse(localStorage.getItem('dataUser')) || '';
  const userRole = dataUser?.roles;
  const authenticated = !!userRole;

  const routes = useRoutes([
    {
      path: '/login',
      element: authenticated ? <DashboardLayout /> : <LoginPage />,
    },
    {
      path: '/change-password',
      element: <ChangePasswordPage />,
    },
    {
      path: '/dashboard',
      element: authenticated ? <Navigate to="/dashboard/app" replace /> : <Navigate to="/login" replace />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <ProjectPage /> },
        {
          path: 'addapplication',
          element: (
            <PrivateRoute
              element={<AddNewApplication />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian', 'Owner']}
            />
          ),
        },
        {
          path: 'detailproject/:id',
          element: (
            <PrivateRoute
              element={<DetailProject />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian', 'Owner']}
            />
          ),
        },

        { path: 'supplier', element: <Supplier /> },
        {
          path: 'progressproject',
          element: <ProgressPage />,
        },
        {
          path: 'projectprogress-daily/:id',
          element: (
            <PrivateRoute
              element={<DetailProjectProgressDaily />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian']}
            />
          ),
        },
        {
          path: 'projectprogress-weekly/:id',
          element: (
            <PrivateRoute
              element={<DetailProjectProgressWeekly />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian']}
            />
          ),
        },
        {
          path: 'paywages',
          element: (
            <PrivateRoute
              element={<PayWagesPage />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian']}
            />
          ),
        },
        {
          path: 'paywages-weekly/:id',
          element: (
            <PrivateRoute
              element={<DetailPayWagesWeekly />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian']}
            />
          ),
        },
        {
          path: 'paywages-daily/:id',
          element: (
            <PrivateRoute
              element={<DetailPayWagesDaily />}
              allowedRoles={['Admin', 'Requester', 'Admin Project', 'Pembelian']}
            />
          ),
        },
        { path: 'user', element: <UserList /> },
        { path: 'stock', element: <Stock /> },
        { path: 'tukang', element: <Tukang /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
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
