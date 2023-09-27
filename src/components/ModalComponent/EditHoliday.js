import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
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
import format from 'date-fns/format';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { Card, Dropdown, TextInput, Button, ModalComponent } from '..';

const ModalEditHoliday = ({ onClick, id }) => {
  const [date, setDate] = useState(moment());

  const handleAdd = () => {
    onClick();
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={5} lg={12}>
        <DatePicker
          sx={{ width: '100%' }}
          value={date}
          onChange={(newValue) => setDate(newValue)}
          format="DD MMMM YYYY"
        />
      </Grid>

      <Grid item xs={5} lg={12}>
        <TextField id="outlined" label="Nama Hari Libur" fullWidth />
      </Grid>

      <Grid item xs={5} lg={12}>
        <Button color="color" variant="contained" label="SIMPAN" size="large" onClick={handleAdd} />
      </Grid>
    </Grid>
  );
};

export default ModalEditHoliday;
