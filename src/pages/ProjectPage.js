import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  Pagination,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Link, useNavigate } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import { Button } from '../components';
import { Axios, currency } from 'src/utils';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useDebounce } from 'src/hooks/useDebounce';
// components
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function ProjectPage() {
  const [value, setValue] = useState([null, null]);
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [data, setData] = useState([]);
  const options = ['Ditolak', 'Pending', 'Disetujui'];
  const roles = 'Approver';
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState('');
  const handleAddApplication = () => {
    navigate('/dashboard/addapplication');
  };

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

  useEffect(() => {
    getProject(debouncedSearch, currentPage, selectedOption, startDate, endDate);
  }, [debouncedSearch, currentPage, selectedOption, startDate, endDate]);

  const getProject = async (search = '', page = 1) => {
    let status_project = '';
    if (selectedOption === 'Ditolak') {
      status_project = 'reject';
    } else if (selectedOption === 'Disetujui') {
      status_project = 'approved';
    } else if (selectedOption === 'pending') {
      status_project = 'request';
    } else {
      status_project = '';
    }
    let dateRangeFilter = '';

    const start = startDate ? startDate.format('YYYY-MM-DD HH:mm:ss') : '';
    const end = endDate ? endDate.format('YYYY-MM-DD HH:mm:ss') : '';
    if (startDate && endDate) {
      dateRangeFilter = `&start=${start}&end=${end}`;
    }
    try {
      const response = await Axios.get(
        `/project/?page=${page}&size=${pageSize}&column_name=nama_project&query=${search}&status=${status_project}${dateRangeFilter}`
      );
      const { totalPages } = response?.data?.data;
      setTotalPages(totalPages);
      if (response.data.message === 'OK') {
        const data = response?.data?.data;
        setData(data?.result);
        console.log(data);
      }
    } catch (error) {
      toast.error('Gagal Ambil Data');
    }
  };
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
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
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

            <Grid item xs={12} sm={6} md={3} lg={4}>
              <Button color="color" variant="contained" size="large" label="TAMBAH" onClick={handleAddApplication} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
