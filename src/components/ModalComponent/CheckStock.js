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

const ModalCheckStock = ({ onClick, id, onSelectedItems, selectedItems }) => {
  const [date, setDate] = useState(moment());
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 1000);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(selectedItems);
  const [addModal, setAddModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState([]);
  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    getStock(debouncedSearch);
  }, [debouncedSearch]);
  const pageSize = 5;

  useEffect(() => {
    if (addModal) {
      setSelectedRows([]);
    }
  }, [addModal]);
  const handleRowSelect = (item) => {
    const selectedIndex = selectedRows.findIndex((selectedItem) => selectedItem.id === item.id);
    let newSelected = [...selectedRows];

    if (selectedIndex === -1) {
      // Item is not selected, so add it to the selection
      newSelected = [...newSelected, item];
    } else {
      // Item is already selected, so remove it from the selection
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedRows(newSelected);
  };
  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);
  const handleAdditem = () => {
    const newSelectedItems = selectedRows.filter((selectedRow) => {
      return !selectedItems.some((existingItem) => existingItem.id === selectedRow.id);
    });
    onSelectedItems([...newSelectedItems]);
    onClick();
  };

  const getStock = async (search = '', page = 1) => {
    try {
      const response = await Axios.get(`/stock/?page=${page}&size=${pageSize}&column_name=nama_barang&query=${search}`);
      console.log(response);
      if (response.data.message === 'OK') {
        const data = response?.data?.data?.result;
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={6} md={3} lg={12}>
        <FormControl variant="outlined" sx={{ width: '100%' }}>
          <InputLabel>Cari Nama Stock</InputLabel>
          <OutlinedInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            endAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
            label="Cari Nama Project"
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3} lg={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>#ID</TableCell>
                <TableCell>Nama Barang</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Harga</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: selectedRows.some((selectedItem) => selectedItem.id === item.id)
                      ? '#e0f7fa' // Change to your desired selected row background color
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
                  <TableCell>{item.nama_barang}</TableCell>
                  <TableCell>{item.supplier?.nama_supplier}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{currency(item.harga)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={4}>
        <Button label="Tambah Stock" variant={'contained'} color={'color'} onClick={handleAdditem} />
      </Grid>
    </Grid>
  );
};

export default ModalCheckStock;
