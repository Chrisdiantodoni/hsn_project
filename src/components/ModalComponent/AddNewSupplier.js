import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from '..';
import { toast } from 'react-toastify';
import { Axios } from 'src/utils';

const ModalAddNewSupplier = ({ onClick }) => {
  const [nama, setNama] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alamat, setAlamat] = useState('');
  const [namaError, setNamaError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [alamatError, setAlamatError] = useState(false);

  const handleAdd = async () => {
    const body = {
      nama_supplier: nama,
      no_hp: phoneNumber,
      alamat,
    };

    if (!nama || !phoneNumber || !alamat) {
      if (!nama) setNamaError(true);
      if (!phoneNumber) setPhoneNumberError(true);
      if (!alamat) setAlamatError(true);

      toast.error('Masih ada Inputan Kosong');
      return;
    }

    try {
      await Axios.post('/supplier', body).then((res) => {
        if (res.data.message === 'OK') {
          toast.success('Sukses Menambahkan Supplier');
          onClick();
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan Supplier');
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
          value={nama}
          onChange={(event) => {
            setNama(event.target.value);
            setNamaError(false); // Reset error when input changes
          }}
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
          value={phoneNumber}
          onChange={(event) => {
            setPhoneNumber(event.target.value);
            setPhoneNumberError(false); // Reset error when input changes
          }}
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
          value={alamat}
          onChange={(event) => {
            setAlamat(event.target.value);
            setAlamatError(false); // Reset error when input changes
          }}
          error={alamatError}
          helperText={alamatError ? 'Alamat tidak boleh kosong' : ''}
        />
      </Grid>

      <Grid lg={8} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="SIMPAN" size="large" onClick={handleAdd} />
      </Grid>
    </Grid>
  );
};

export default ModalAddNewSupplier;
