import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from '..';
import { toast } from 'react-toastify';
import { Axios } from 'src/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { addSupplier } from 'src/API/supplier';

const ModalAddNewSupplier = ({ onClick }) => {
  const { handleSubmit, register } = useForm();
  const [namaError, setNamaError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [alamatError, setAlamatError] = useState(false);

  const addSupplierMutation = useMutation({
    mutationFn: async (body) => {
      const response = await addSupplier(body);

      return response.data;
    },
    onSuccess: () => {
      toast.success('Berhasil menambahkan supplier');
    },
  });

  const onSubmitData = (data) => {
    if (data.nama_supplier == '') {
      setNamaError(true);
    } else {
      setNamaError(false);
    }
    if (data.no_hp == '') {
      setPhoneNumberError(true);
    } else {
      setPhoneNumberError(false);
    }
    if (data.alamat == '') {
      setAlamatError(true);
    } else {
      setAlamatError(false);
    }

    if (data === '') {
      addSupplierMutation.mutateAsync(data);
    }
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="Nama Supplier"
          fullWidth
          {...register('nama_supplier')}
          error={namaError}
          helperText={namaError ? 'Nama Supplier tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="No. Hp"
          fullWidth
          {...register('no_hp')}
          error={phoneNumberError}
          helperText={phoneNumberError ? 'No. Hp tidak boleh kosong' : ''}
        />
      </Grid>

      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="Alamat"
          fullWidth
          {...register('alamat')}
          error={alamatError}
          helperText={alamatError ? 'Alamat tidak boleh kosong' : ''}
        />
      </Grid>

      <Grid lg={8} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="SIMPAN" size="large" onClick={handleSubmit(onSubmitData)} />
      </Grid>
    </Grid>
  );
};

export default ModalAddNewSupplier;
