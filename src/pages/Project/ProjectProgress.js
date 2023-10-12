import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// @mui
import {
  Box,
  Stack,
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
  TextField,
  Pagination,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Link } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import 'rsuite/dist/rsuite.css';
import { getProgress } from 'src/API';
import { Axios, currency } from 'src/utils';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useDebounce } from 'src/hooks/useDebounce';
// components
import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

export default function ProjectPage() {
  const [id, setId] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 1000);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  const start = startDate ? startDate.format('YYYY-MM-DD HH:mm:ss') : '';
  const end = endDate ? endDate.format('YYYY-MM-DD HH:mm:ss') : '';

  const {
    isLoading,
    error,
    data: data,
  } = useQuery({
    queryKey: ['progress', { debouncedSearch, currentPage, pageSize, start, end }],
    queryFn: async () => {
      const response = await getProgress(debouncedSearch, currentPage, pageSize, start, end);
      return response;
    },
  });

  if (error) return <div>An error occurred: {error.message}</div>;

  console.log(data?.data);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    console.log(newPage);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Box>
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Pagination count={totalPages} page={currentPage} shape="rounded" color="color" onChange={handlePageChange} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#ID</TableCell>
                  <TableCell>Nama Project</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Mulai</TableCell>
                  <TableCell>Selesai</TableCell>
                  <TableCell>Tanggal Pengajuan</TableCell>
                  <TableCell>Status Penyelesaian</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.result.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nama_project}</TableCell>
                    <TableCell>{currency(item.harga)}</TableCell>
                    <TableCell>{moment(item.start).format('DD MMMM YYYY')}</TableCell>
                    <TableCell>{moment(item.end).format('DD MMMM YYYY')}</TableCell>
                    <TableCell>{moment(item.createdAt).format('DD MMMM YYYY')}</TableCell>
                    <TableCell>{item.status_penyelesaian}</TableCell>
                    <TableCell>
                      <Link
                        to={
                          item?.type === 'Harian'
                            ? `/dashboard/projectprogress-daily/${item.id}`
                            : `/dashboard/projectprogress-weekly/${item.id}`
                        }
                      >
                        [Lihat]
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3} sx={{ alignItems: 'center', mb: 3, alignContent: 'center' }}>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <DatePicker
                size="lg"
                label="Dari"
                value={startDate}
                sx={{ width: '100%' }}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <DatePicker
                size="lg"
                label="Sampai"
                value={endDate}
                sx={{ width: '100%' }}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel>Cari Nama Project</InputLabel>
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
            <Grid lg={4} />
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
