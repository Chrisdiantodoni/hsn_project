import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
// components
import { useAuth } from '../../../context/AuthContext';
import Iconify from '../../../components/iconify';
import 'react-toastify/dist/ReactToastify.css';
import { Axios, currency } from '../../../utils';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const { authUser, setAuthUser, isLoggedIn, setIsLoggedin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const StringifyLocalStorage = ({ name = '', value }) => {
    const result = localStorage.setItem(name, value);
    if (name && value) {
      return result;
    } else {
      return window.alert('Parsing Gagal');
    }
  };
  const handleLogin = async (e) => {
    const body = {
      email,
      password,
    };
    console.log(body);
    try {
      e.preventDefault();
      const response = await Axios.post('/auth/login', body);
      console.log(response);
      if (response.data.message === 'OK' || response.data.reset_password === null || false) {
        toast.success('Berhasil');
        const token = response.data?.data?.token;
        const refreshToken = response.data.data.refreshToken;
        const dataUser = response.data.data.data;
        StringifyLocalStorage({
          name: 'token',
          value: token,
        });
        StringifyLocalStorage({
          name: 'refreshToken',
          value: refreshToken,
        });
        StringifyLocalStorage({
          name: 'dataUser',
          value: JSON.stringify(dataUser),
        });
        toast.success('Berhasil Login');
        navigate('/dashboard/app');
      } else {
        const dataUser = response?.data?.data;
        console.log(dataUser);
        navigate('/change-password', { state: { userId: dataUser.id } });
      }
    } catch (error) {
      toast.error('Email atau Password Salah');
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <TextField
            name="email"
            label="Email address"
            sx={{ mt: 3 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
        <Stack mt={3}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" color="color">
            Login
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
}
