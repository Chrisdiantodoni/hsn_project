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
  TextField,
  Pagination,
} from '@mui/material';
import { useDebounce } from 'src/hooks/useDebounce';
import { Link } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import 'rsuite/dist/rsuite.css';
import { Button, DatePicker, ModalAddNewUser, ModalComponent, ModalEditUser } from '../../components';
import { Axios } from 'src/utils';
import { useQuery } from '@tanstack/react-query';
import { getUser } from 'src/API/auth';
// components

// ----------------------------------------------------------------------

export default function UserList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [id, setId] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 1000);
  const pageSize = 10;

  const handleEditModal = (item) => {
    setId(item.id);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  const {
    isLoading,
    data: data,
    error,
  } = useQuery({
    queryKey: ['users', { currentPage, pageSize, debouncedSearch }],
    queryFn: async () => {
      const response = await getUser(currentPage, pageSize, debouncedSearch);
      return response;
    },
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
                  <TableCell>Nama</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.result.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nama_lengkap}</TableCell>
                    <TableCell>{item.roles}</TableCell>
                    <TableCell>
                      <Button
                        color="color"
                        variant=""
                        label="[Lihat Rincian]"
                        size="small"
                        onClick={() => handleEditModal(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={10} sx={{ alignItems: 'center', mb: 3, alignContent: 'center' }}>
            <Grid item xs={12} sm={6} md={3} lg={6}>
              <></>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel>Cari Nama/Role User</InputLabel>
                <OutlinedInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  endAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  label="Cari Nama/Role User"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                color="color"
                variant="contained"
                label="TAMBAH"
                size="large"
                onClick={() => setIsAddModalOpen(true)}
              />
            </Grid>
          </Grid>
        </Stack>
        <ModalComponent open={isAddModalOpen} close={() => setIsAddModalOpen(false)} title={'Tambah User'}>
          <ModalAddNewUser onClick={() => setIsAddModalOpen(false)} />
        </ModalComponent>
        <ModalComponent open={isEditModalOpen} close={() => setIsEditModalOpen(false)} title={`Edit User ${id}`}>
          <ModalEditUser onClick={() => setIsEditModalOpen(false)} />
        </ModalComponent>
      </Container>
    </>
  );
}
