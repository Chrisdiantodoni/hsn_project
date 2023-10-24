import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
// components
import Iconify from '../../../components/iconify';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from 'src/API/auth';

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const StringifyLocalStorage = ({ name = '', value }) => {
    const result = localStorage.setItem(name, value);
    if (name && value) {
      return result;
    } else {
      return window.alert('Parsing Gagal');
    }
  };
  const mutation = useMutation({
    mutationFn: async (userId, body) => {
      const response = await changePassword(userId, body); // Capture the response
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      const token = data.token;
      const refreshToken = data.refreshToken;
      const dataUser = data.data;
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
    },
  });
  const handleClick = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      await mutation.mutateAsync(userId, newPassword);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('An error occurred while changing the password');
      console.error(error);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          sx={{ mt: 3 }}
          name="newPassword"
          label="New Password"
          type={showSecondPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowSecondPassword(!showSecondPassword)} edge="end">
                  <Iconify icon={showSecondPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          name="confirmPassword"
          label="Confirm New Password"
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!passwordsMatch && (
          <Typography variant="body2" color="error">
            Passwords do not match.
          </Typography>
        )}
      </Stack>
      <Stack mt={3}>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleClick} color="color">
          KIRIM
        </LoadingButton>
      </Stack>
    </>
  );
}
