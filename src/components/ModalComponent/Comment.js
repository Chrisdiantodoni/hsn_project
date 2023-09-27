import React, { useState } from 'react';

import TextField from '@mui/material/TextField';

import { Grid } from '@mui/material';
import format from 'date-fns/format';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Card, Dropdown, TextInput, Button, ModalComponent } from '..';
import 'react-toastify/dist/ReactToastify.css';

const ModalComment = ({ onClick, id, payload }) => {
  const [date, setDate] = useState(moment());

  const handleAdd = () => {
    console.log(payload);
    toast.success('Tolak');
    onClick();
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={12}>
        <TextField id="outlined" label="Alasan" fullWidth />
      </Grid>
      <Grid item xs={5} lg={4} />
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="outlined" label="BATAL" size="large" onClick={handleAdd} />
      </Grid>
      <Grid item xs={5} lg={4}>
        <Button color="color" variant="contained" label="TAMBAH" size="large" onClick={handleAdd} />
      </Grid>
    </Grid>
  );
};

export default ModalComment;
