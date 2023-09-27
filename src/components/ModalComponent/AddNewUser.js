import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../components/iconify';
import { toast } from 'react-toastify';
import { Axios } from 'src/utils';
import { Button } from '..';

const ModalAddNewStaff = ({ onClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(null);
  const [pin, setPin] = useState('');
  const [namaError, setNamaError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [pinError, setPinError] = useState(false);

  const options = ['Accounting', 'Project Manager', 'Owner', 'Finance', 'Admin'];

  const handleRegister = () => {
    // Validate the inputs
    if (!nama || !email || !password || !role || !pin) {
      if (!nama) setNamaError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      if (!role) setRoleError(true);
      if (!pin) setPinError(true);

      toast.error('Ada Inputan yang belum diisi');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      toast.error('Format Email tidak valid.');
      return;
    } else {
      setEmailError(false);
    }

    const body = {
      nama_lengkap: nama,
      email,
      password,
      roles: role,
      pin,
    };

    Axios.post('/auth/register', body)
      .then((res) => {
        if (res.data.message === 'OK') {
          toast.success('User berhasil ditambahkan');
          onClick();
        }
      })
      .catch((res) => {
        console.error(res);
        toast.error('Gagal menambahkan user');
      });
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          value={nama}
          onChange={(event) => {
            setNama(event.target.value);
            setNamaError(false); // Reset error when input changes
          }}
          id="outlined-required"
          label="Nama Lengkap"
          fullWidth
          error={namaError}
          helperText={namaError ? 'Nama Lengkap tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError(false); // Reset error when input changes
          }}
          id="outlined-required"
          label="Email"
          fullWidth
          error={emailError}
          helperText={emailError ? 'Format Email tidak valid' : ''}
        />
      </Grid>

      <Grid item xs={5} lg={6}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options}
          value={role}
          onChange={(event, newValue) => {
            setRole(newValue);
            setRoleError(false);
          }}
          renderInput={(params) => <TextField {...params} label="Role" fullWidth />}
          error={roleError}
          helperText={roleError ? 'Role tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          fullWidth
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
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false); // Reset error when input changes
          }}
          error={passwordError}
          helperText={passwordError ? 'Password tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          fullWidth
          name="pin"
          label="Pin"
          type={showPin ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                  <Iconify icon={showPin ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={pin}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, '');
            setPin(numericValue);
            setPinError(false); // Reset error when input changes
          }}
          error={pinError}
          helperText={pinError ? 'Pin tidak boleh kosong' : ''}
        />
      </Grid>

      <Grid lg={8} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="SIMPAN" size="large" onClick={handleRegister} />
      </Grid>
    </Grid>
  );
};

export default ModalAddNewStaff;
