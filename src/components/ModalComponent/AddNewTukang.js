import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import { Grid, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { Button } from '..';
import { toast } from 'react-toastify';
import { Axios } from 'src/utils';
import { addSupplier, addTukang } from 'src/API';

const ModalAddNewTukang = ({ onClick }) => {
  const { register, handleSubmit } = useForm();

  const [namaError, setNamaError] = useState(false);
  const [ktpError, setKtpError] = useState(false);
  const [alamatError, setAlamatError] = useState(false);
  const [noHpError, setNoHpError] = useState(false);
  const [typeError, setTypeError] = useState(false);

  const mutation = useMutation({
    mutationFn: async (body) => {
      addTukang(body);
    },
    onSuccess: () => {
      toast.success('Berhasil Menambahkan Tukang');
      onClick();
    },
  });

  const handleAddTukang = async (data) => {
    let hasErrors = false;

    if (data.nama_tukang === '') {
      setNamaError(true);
      hasErrors = true;
    } else {
      setNamaError(false);
    }

    if (data.no_ktp.length !== 16) {
      setKtpError(true);
      hasErrors = true;
    } else {
      setKtpError(false);
    }

    if (data.alamat.trim() === '') {
      setAlamatError(true);
      hasErrors = true;
    } else {
      setAlamatError(false);
    }

    if (data.no_hp.length !== 10) {
      setNoHpError(true);
      hasErrors = true;
    } else {
      setNoHpError(false);
    }

    if (data.type === '') {
      setTypeError(true);
      hasErrors = true;
    } else {
      setTypeError(false);
    }

    if (hasErrors) {
      // There are errors, do not submit the form
      return;
    }

    // No errors, submit the form
    mutation.mutateAsync(data);
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="Nama Sesuai KTP"
          fullWidth
          {...register('nama_tukang')}
          error={namaError}
          helperText={namaError ? 'Nama tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="No. KTP"
          fullWidth
          {...register('no_ktp')}
          error={ktpError}
          helperText={ktpError ? 'No. KTP harus memiliki 16 karakter' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="Alamat"
          {...register('alamat')}
          fullWidth
          error={alamatError}
          helperText={alamatError ? 'Alamat tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="No. Handphone"
          {...register('no_hp')}
          fullWidth
          error={noHpError}
          helperText={noHpError ? 'No. Handphone harus memiliki 10 karakter' : ''}
        />
      </Grid>
      <Grid item lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            error={typeError}
            helperText={typeError}
            {...register('type')}
          >
            <MenuItem value={'Tukang'}>Tukang</MenuItem>
            <MenuItem value={'Kernet'}>Kernet</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid lg={8} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="TAMBAH" size="large" onClick={handleSubmit(handleAddTukang)} />
      </Grid>
    </Grid>
  );
};

export default ModalAddNewTukang;
