import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { AuthProvider } from './context/AuthContext';
// ----------------------------------------------------------------------

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <BrowserRouter>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
              </ThemeProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </AuthProvider>
        <ToastContainer />
      </HelmetProvider>
    </QueryClientProvider>
  );
}
