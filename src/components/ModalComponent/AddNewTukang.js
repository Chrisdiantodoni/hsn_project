import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Grid, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { Button } from '..';
import { toast } from 'react-toastify';
import { Axios } from 'src/utils';

const ModalAddNewTukang = ({ onClick }) => {
  const [nama, setNama] = useState('');
  const [ktp, setKtp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');
  const [namaError, setNamaError] = useState(false);
  const [ktpError, setKtpError] = useState(false);
  const [alamatError, setAlamatError] = useState(false);
  const [noHpError, setNoHpError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [type, setType] = useState('');

  const handleAddTukang = async () => {
    const body = { nama_tukang: nama, no_ktp: ktp, alamat, no_hp: noHp };

    if (!nama || !ktp || !alamat || !noHp) {
      if (!nama) setNamaError(true);
      if (!ktp) setKtpError(true);
      if (!alamat) setAlamatError(true);
      if (!noHp) setNoHpError(true);
      if (!type) setTypeError(true);

      toast.error('Masih ada Inputan Kosong');
      return;
    }

    if (ktp.length !== 16) {
      setKtpError(true);
      return;
    } else {
      setKtpError(false);
    }

    if (noHp.length < 10) {
      setNoHpError(true);
      return;
    } else {
      setNoHpError(false);
    }

    await Axios.post('/tukang', body)
      .then((res) => {
        if (res.data.message === 'OK') {
          toast.success('Berhasil Menambahkan Tukang');
        }
        onClick();
      })
      .catch((res) => {
        console.log(res);
        toast.error('Gagal Menambahkan Tukang');
      });
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="Nama Sesuai KTP"
          fullWidth
          value={nama}
          onChange={(e) => {
            setNama(e.target.value);
            setNamaError(false); // Reset error when input changes
          }}
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
          value={ktp}
          onChange={(e) => {
            setKtp(e.target.value);
            setKtpError(false); // Reset error when input changes
          }}
          error={ktpError}
          helperText={ktpError ? 'No. KTP harus memiliki 16 karakter' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="Alamat"
          fullWidth
          value={alamat}
          onChange={(e) => {
            setAlamat(e.target.value);
            setAlamatError(false); // Reset error when input changes
          }}
          error={alamatError}
          helperText={alamatError ? 'Alamat tidak boleh kosong' : ''}
        />
      </Grid>
      <Grid item xs={5} lg={6}>
        <TextField
          required
          id="outlined-required"
          label="No. Handphone"
          fullWidth
          value={noHp}
          onChange={(e) => {
            setNoHp(e.target.value);
            setNoHpError(false); // Reset error when input changes
          }}
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
            value={type}
            label="Status"
            error={typeError}
            helperText={typeError}
            onChange={(event) => {
              setType(event.target.value);
              setTypeError(false);
            }}
          >
            <MenuItem value={'Tukang'}>Tukang</MenuItem>
            <MenuItem value={'Kernet'}>Kernet</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid lg={8} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="TAMBAH" size="large" onClick={handleAddTukang} />
      </Grid>
    </Grid>
  );
};

export default ModalAddNewTukang;
