import { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableContainer,
  TableBody,
} from '@mui/material';

const HistoryPayModel = ({ item, onClick }) => {
  console.log(item);
  return (
    <Container>
      <Grid container>
        <Grid item lg={6}></Grid>
        <Grid item lg={6}></Grid>
      </Grid>
    </Container>
  );
};

export default HistoryPayModel;
