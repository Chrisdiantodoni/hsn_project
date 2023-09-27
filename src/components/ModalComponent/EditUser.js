import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { useTheme, styled } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Paper,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Card, Dropdown, TextInput, Button, ModalComponent } from '..';

const ModalEditUser = ({ onClick, id }) => {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleEdit = () => {
    onClick();
  };

  const options = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={6}>
        <TextField required id="outlined-required" label="Kode" fullWidth />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField required id="outlined-required" label="Nama" fullWidth />
      </Grid>
      <Grid item xs={5} lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={role}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value={'Requester'}>Requester</MenuItem>
            <MenuItem value={'Approver'}>Approver</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5} lg={6}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options}
          renderInput={(params) => <TextField {...params} label="Departmen" fullWidth />}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField required id="outlined" label="Username" disabled defaultValue={'Doni'} fullWidth />
      </Grid>
      <Grid item xs={5} lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            label="Status"
            onChange={handleChangeStatus}
          >
            <MenuItem value={'Aktif'}>Aktif</MenuItem>
            <MenuItem value={'Tidak Aktif'}>Tidak Aktif</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid lg={4} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="outlined" label="RESET PASSWORD" size="large" onClick={onClick} />
      </Grid>
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="SIMPAN" size="large" onClick={handleEdit} />
      </Grid>
    </Grid>
  );
};

export default ModalEditUser;
