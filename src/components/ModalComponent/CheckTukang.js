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
import { Card, Dropdown, TextInput, Button, ModalComponent, ModalAddNewTukang } from '..';
import { useDebounce } from 'src/hooks/useDebounce';
import { Axios, currency } from 'src/utils';

const ModalCheckTukang = ({ onClick, id, onSelectedItems, selectedItems }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 1000);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(selectedItems);
  const [addModal, setAddModal] = useState(false);

  console.log(selectedRows);

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    getTukang(debouncedSearch);
  }, [addModal, debouncedSearch]);

  const pageSize = 5;

  const handleRowSelect = (item) => {
    const selectedIndex = selectedRows.findIndex((selectedItem) => selectedItem.id === item.id);
    let newSelected = [...selectedRows];

    if (selectedIndex === -1) {
      newSelected = [...newSelected, item];
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedRows(newSelected);
  };

  const getTukang = async (search = '', page = 1) => {
    console.log(page);
    try {
      const response = await Axios.get(
        `/tukang/?page=${page}&size=${pageSize}&column_name=nama_tukang&query=${search}`
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

  const handleAdditem = () => {
    const newSelectedItems = selectedRows.filter((selectedRow) => {
      return !selectedItems.some((existingItem) => existingItem.id === selectedRow.id);
    });
    onSelectedItems([...newSelectedItems]);
    onClick();
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={6} md={3} lg={8}>
        <FormControl variant="outlined" sx={{ width: '100%' }}>
          <InputLabel>Cari Nama Tukang</InputLabel>
          <OutlinedInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            endAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
            label="Cari Nama Tukang"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={4}>
        <Button label="Tambah Tukang" variant={'contained'} color={'color'} onClick={() => setAddModal(true)} />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>#ID</TableCell>
                <TableCell>Nama Tukang</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>No Hp</TableCell>
                <TableCell>Alamat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: selectedRows.some((selectedItem) => selectedItem.id === item.id)
                      ? '#e0f7fa'
                      : 'inherit',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowSelect(item)}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.some((selectedItem) => selectedItem.id === item.id)}
                      onChange={() => handleRowSelect(item)}
                    />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nama_tukang}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.no_hp}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={4}>
        <Button label="Tambah Tukang" variant={'contained'} color={'color'} onClick={handleAdditem} />
      </Grid>
      <ModalComponent open={addModal} close={() => setAddModal(false)} title={'Tambah Tukang'}>
        <ModalAddNewTukang onClick={() => setAddModal(false)} />
      </ModalComponent>
    </Grid>
  );
};

export default ModalCheckTukang;
