import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
// components
import Iconify from '../../../components/iconify';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);

  const handleClick = () => {
    toast.success('Change Password Success');
    navigate('/dashboard/app');
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          sx={{ mt: 3 }}
          name="Password Baru"
          label="Password Baru"
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
        />
        <TextField
          name="Ulangi Password Baru"
          label="Ulangi Password Baru"
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
        />
      </Stack>
      <Stack mt={3}>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} color="color">
          KIRIM
        </LoadingButton>
      </Stack>
    </>
  );
}
