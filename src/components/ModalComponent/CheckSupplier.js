import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';

import {
  Grid,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Paper,
} from '@mui/material';
import format from 'date-fns/format';
import { DatePicker } from '@mui/x-date-pickers';
import Search from '@mui/icons-material/Search';
import moment from 'moment';
import { Card, Dropdown, TextInput, Button, ModalComponent } from '..';
import { useDebounce } from 'src/hooks/useDebounce';
import { Axios, currency } from 'src/utils';
import ModalAddNewSupplier from './AddNewSupplier';

const ModalCheckSupplier = ({ onClick, id, onSelectedItems }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 1000);
  const [data, setData] = useState([]);
  const [showSupplier, setShowSupplier] = useState(false);
  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    getSupplier(debouncedSearch);
  }, [debouncedSearch]);
  const pageSize = 5;

  const handleRowSelect = (item) => {
    setSelectedSupplier(item);
  };
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    onSelectedItems(selectedSupplier);
  }, [selectedSupplier]);

  const handleAdd = () => {
    onClick();
  };
  const getSupplier = async (search = '', page = 1) => {
    try {
      const response = await Axios.get(
        `/supplier/?page=${page}&size=${pageSize}&column_name=nama_supplier&query=${search}`
      );
      console.log(response);
      if (response.data.message === 'OK') {
        const data = response?.data?.data?.result;
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!showSupplier) {
      getSupplier();
      console.log('ModalAddNewSupplier has been closed. You can call your useEffect here.');
    }
  }, [showSupplier]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={6} md={3} lg={8}>
        <FormControl variant="outlined" sx={{ width: '100%' }}>
          <InputLabel>Cari Supplier</InputLabel>
          <OutlinedInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            endAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
            label="Cari Supplier"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={4}>
        <Button label="Tambah Supplier" variant={'contained'} color={'color'} onClick={() => setShowSupplier(true)} />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>#ID</TableCell>
                <TableCell>Nama Supplier</TableCell>
                <TableCell>Alamat</TableCell>
                <TableCell>No. Hp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <input type="radio" checked={selectedSupplier === item} onChange={() => handleRowSelect(item)} />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nama_supplier}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                  <TableCell>{item.no_hp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={4}>
        <Button label="Gunakan Supplier" variant={'contained'} color={'color'} onClick={handleAdd} />
      </Grid>
      <ModalComponent open={showSupplier} close={() => setShowSupplier(false)} title={'Tambah Supplier Baru'}>
        <ModalAddNewSupplier onClick={() => setShowSupplier(false)} />
      </ModalComponent>
    </Grid>
  );
};

export default ModalCheckSupplier;
