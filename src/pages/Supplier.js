import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Container,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Autocomplete,
  TextField,
  Pagination,
  Skeleton,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import 'rsuite/dist/rsuite.css';
import { Button } from '../components';
import { Axios } from 'src/utils';
import { toast } from 'react-toastify';
import { useDebounce } from 'src/hooks/useDebounce';
import { ModalComponent, ModalAddNewSupplier } from '../components';
// components

// ----------------------------------------------------------------------

export default function Supplier() {
  const [search, setSearch] = useState('');
  const [dataSupplier, setDataSupplier] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 1000);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  const getData = async (search = '', page = 1) => {
    try {
      setIsLoading(true);
      const response = await Axios.get(
        `/supplier?page=${page}&size=${pageSize}&column_name=nama_supplier&query=${search}&id=${search}`
      );
      const { totalPages } = response?.data?.data;
      setTotalPages(totalPages);
      console.log(response);
      if (response.data.message === 'OK') {
        const data = response?.data?.data?.result;
        setDataSupplier(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error('Gagal ambil data');
    }
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    console.log(newPage);
  };

  useEffect(() => {
    getData(debouncedSearch, currentPage, isAddModalOpen);
  }, [debouncedSearch, currentPage, isAddModalOpen]);

  const handleExport = async () => {
    try {
      const response = await Axios.get('supplier/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'suppliers.csv');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Pagination count={totalPages} page={currentPage} shape="rounded" color="color" onChange={handlePageChange} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#ID</TableCell>
                  <TableCell>Nama Supplier</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>No. Handphone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(isLoading ? Array.from({ length: pageSize }) : dataSupplier).map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.id}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.nama_supplier}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.alamat}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.no_hp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={10} sx={{ alignItems: 'center', mb: 3, alignContent: 'center' }}>
            <Grid item xs={12} sm={6} md={3} lg={6}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel>Cari Nama Supplier</InputLabel>
                <OutlinedInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  endAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  label="Cari Nama Supplier"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <Button
                label={'Tambah Supplier'}
                onClick={() => setIsAddModalOpen(true)}
                color={'color'}
                variant={'contained'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button label={'Export'} onClick={handleExport} color={'color'} variant={'contained'} />
            </Grid>
          </Grid>
        </Stack>
        <ModalComponent open={isAddModalOpen} close={() => setIsAddModalOpen(false)} title={'Tambah Supplier'}>
          <ModalAddNewSupplier onClick={() => setIsAddModalOpen(false)} />
        </ModalComponent>
      </Container>
    </>
  );
}
