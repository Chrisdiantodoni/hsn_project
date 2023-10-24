import { Helmet } from 'react-helmet-async';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
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
  Autocomplete,
  Pagination,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Link, useNavigate } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import 'rsuite/dist/rsuite.css';
import { Button } from '../components';
import { currency } from 'src/utils';
import moment from 'moment';
import { useDebounce } from 'src/hooks/useDebounce';
// components
import 'react-toastify/dist/ReactToastify.css';
import { getProject } from '../API';
// ----------------------------------------------------------------------

export default function ProjectPage() {
  const dataUser = localStorage.getItem('dataUser');
  const roles = JSON.parse(dataUser)?.roles;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const options = ['Ditolak', 'Pending', 'Disetujui'];
  const [search, setSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const handleAddApplication = () => {
    navigate('/dashboard/addapplication');
  };
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  let status_project;
  if (selectedOption === 'Ditolak') {
    status_project = 'reject';
  } else if (selectedOption === 'Disetujui') {
    status_project = 'approved';
  } else if (selectedOption === 'Pending') {
    status_project = 'request';
  } else {
    status_project = '';
  }

  const start = startDate ? startDate.format('YYYY-MM-DD HH:mm:ss') : '';
  const end = endDate ? endDate.format('YYYY-MM-DD HH:mm:ss') : '';
  const {
    isLoading,
    data: data,
    error,
  } = useQuery({
    queryKey: ['result', debouncedSearch, currentPage, status_project, start, end],
    queryFn: async () => {
      const data = await getProject(debouncedSearch, currentPage, pageSize, status_project, start, end);
      return data;
    },
  });

  if (error) return <div>An error occurred: {error.message}</div>;

  queryClient.invalidateQueries({
    queryKey: 'result',
  });

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
                  <TableCell>Nama Project</TableCell>
                  <TableCell>Harga</TableCell>
                  <TableCell>Mulai</TableCell>
                  <TableCell>Selesai</TableCell>
                  <TableCell>Tanggal Pengajuan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.result.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nama_project}</TableCell>
                    <TableCell>{currency(item.harga)}</TableCell>
                    <TableCell>{moment(item.start).format('DD MMMM YYYY')}</TableCell>
                    <TableCell>{moment(item.end).format('DD MMMM YYYY')}</TableCell>
                    <TableCell>{moment(item.createdAt).format('DD MMMM YYYY')}</TableCell>
                    <TableCell
                      sx={{
                        color: item.status === 'reject' ? '#E84040' : item.status === 'approve' ? '#028617' : '#000000',
                      }}
                    >
                      {item.status == 'request' ? 'Pending' : item.status === 'reject' ? 'Ditolak' : 'Disetujui'}
                    </TableCell>
                    <TableCell>
                      <Link to={`/dashboard/detailproject/${item.id}`}>[Lihat]</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={3} sx={{ alignItems: 'center', mb: 3, alignContent: 'center' }}>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Status Pengajuan" />}
              />
            </Grid>
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
                <InputLabel
                  sx={{
                    paddingRight: 5,
                  }}
                >
                  Cari Nama Project
                </InputLabel>
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
            {roles === 'Manager Project' || 'Admin' ? (
              <Grid item xs={12} sm={6} md={3} lg={4}>
                <Button color="color" variant="contained" size="large" label="TAMBAH" onClick={handleAddApplication} />
              </Grid>
            ) : null}
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
