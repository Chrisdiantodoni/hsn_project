import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Axios, currency } from 'src/utils';
import { toast } from 'react-toastify';
import { useDebounce } from 'src/hooks/useDebounce';
import { Button } from 'src/components';
import { getStock } from 'src/API';
// components

// ----------------------------------------------------------------------

export default function Stock() {
  const [search, setSearch] = useState('');
  const [dataStock, setDataStock] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  const {
    isLoading,
    data: data,
    error,
  } = useQuery({
    queryKey: ['stock', { currentPage, pageSize, debouncedSearch }],
    queryFn: async () => {
      const response = await getStock(currentPage, pageSize, debouncedSearch);
      return response;
    },
  });

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    console.log(newPage);
  };

  const handleExport = async () => {
    try {
      const response = await Axios.get('/stock/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stock.csv');
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
          <Pagination
            count={data?.totalPages}
            page={currentPage}
            shape="rounded"
            color="color"
            onChange={handlePageChange}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#ID</TableCell>
                  <TableCell>Nama Barang</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Harga</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(isLoading ? Array.from({ length: pageSize }) : data?.data.result).map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.id}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.nama_barang}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.supplier?.nama_supplier}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : item.qty}</TableCell>
                    <TableCell>{isLoading ? <Skeleton animation="wave" /> : currency(item.harga)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={3} sx={{ alignItems: 'center', mb: 3, alignContent: 'center' }}>
            <Grid item xs={12} sm={6} md={3} lg={6}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel>Cari Stock/Kode Stock/Nama Supplier</InputLabel>
                <OutlinedInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  endAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  label="Cari Stock/Kode Stock/Nama Supplier"
                />
              </FormControl>
            </Grid>
            <Grid lg={3} />
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Button label={'Export'} color={'color'} variant={'contained'} onClick={handleExport} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
