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
import { toast } from 'react-toastify';
import { Card, Dropdown, TextInput, Button, ModalComponent } from '..';

const ModalEditTukang = ({ onClick }) => {
  const [status, setStatus] = useState('');
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleChange = (event) => {
    setStatus(event.target.value);
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

  const handleAddUser = () => {
    toast.success('Sukses Menambah Staff');
    onClick();
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={6}>
        <TextField required id="outlined-required" label="Nama" fullWidth />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField required id="outlined-required" label="Kode" fullWidth />
      </Grid>
      <Grid item xs={5} lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value={10}>Aktif</MenuItem>
            <MenuItem value={20}>Tidak Aktif</MenuItem>
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
        <TextField required id="outlined-required" label="Jabatan" fullWidth />
      </Grid>
      <Grid lg={8} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="TAMBAH" size="large" onClick={handleAddUser} />
      </Grid>
    </Grid>
  );
};

export default ModalEditTukang;
