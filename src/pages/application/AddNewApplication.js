import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { useMutation } from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Paper,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Axios, currency } from 'src/utils';
import { Button, ModalComponent, ModalCheckStock, ModalCheckTukang } from '../../components';
import ModalCheckSupplier from 'src/components/ModalComponent/CheckSupplier';
import { toast } from 'react-toastify';
import { addProject } from 'src/API';

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddNewApplication() {
  const [addModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isModalSupplier, setIsModalSupplier] = useState(false);
  const [isModalTukang, setIsAddModalTukang] = useState(false);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');
  const options = ['HO', 'GS', 'GH'];
  const optionsKerjaan = ['Borongan', 'Harian'];
  const [selectKerjaan, setSelectKerjaan] = useState('');
  const [project, setProject] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [listTukang, setListTukang] = useState([]);
  const [allStock, setAllStock] = useState([]);
  const [stockError, setStockError] = useState(false);
  const [jobError, setJobError] = useState(false);

  const handleImageChange = (event) => {
    const files = event.target.files;
    setSelectedImages((prev) => [...prev, ...files]);
  };
  const handleSelectedItems = (selectedItems) => {
    setSelectedCards((prev) => [...prev, ...selectedItems]);
  };

  const handleDelete = (id) => {
    const updatedSelectedCards = selectedCards.filter((item) => item.id !== id);
    setSelectedCards(updatedSelectedCards);
  };
  const handleDeleteJob = (id) => {
    const updatedSelectedJob = listJob.filter((item) => item.id !== id);
    setListJob(updatedSelectedJob);
  };
  const handleDeleteTukang = (id) => {
    const updatedSelectedTukang = listTukang.filter((item) => item.id !== id);
    setListTukang(updatedSelectedTukang);
  };
  const handleSelectedTukang = (selectedItems) => {
    setListTukang((prev) => [...prev, ...selectedItems]);
  };
  const [newSupplierRow, setNewSupplierRow] = useState({
    id: '',
    nama_barang: '',
    supplier: '',
    qty: 0,
    harga: 0,
  });

  const handleAddRow = () => {
    if (!newSupplierRow.harga) {
      toast.error('barang tidak boleh kosong');
      setStockError(true);
      return;
    } else if (!newSupplierRow.nama_barang) {
      toast.error('barang tidak boleh kosong');
      setStockError(true);
      return;
    } else if (!newSupplierRow.supplier) {
      toast.error('barang tidak boleh kosong');
      setStockError(true);
      return;
    } else if (!newSupplierRow.qty) {
      toast.error('barang tidak boleh kosong');
      setStockError(true);
      return;
    }
    setStockError(false);

    const randomId = generateRandomId(2);

    const newRow = {
      id: randomId,
      nama_barang: newSupplierRow.nama_barang,
      supplier: newSupplierRow.supplier,
      qty: parseInt(newSupplierRow.qty),
      harga: parseInt(newSupplierRow.harga),
    };

    setSelectedCards([...selectedCards, newRow]);

    setNewSupplierRow({
      id: '',
      nama_barang: '',
      supplier: '',
      qty: 0,
      harga: 0,
    });
  };

  const [listJob, setListJob] = useState([]);
  const [newJobRow, setNewJobRow] = useState({
    id: '',
    name: '',
    qty: 0,
    harga: 0,
  });
  function generateRandomId(length) {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }

    return id;
  }

  const handleAddJobRow = () => {
    if (!newJobRow.name) {
      setJobError(true);
      toast.error('Job tidak boleh kosong');
      return;
    }
    setJobError(false);
    const randomId = generateRandomId(2);

    setListJob([...listJob, newJobRow]);

    const newRow = {
      id: randomId,
      name: newJobRow.name,
      qty: parseInt(newJobRow.qty),
      harga: parseInt(newJobRow.harga),
    };

    setListJob([...listJob, newRow]);

    setNewJobRow({
      id: '',
      name: '',
      qty: 0,
      harga: 0,
    });
  };
  const handleSelectedSupplier = (selectedSupplier) => {
    setNewSupplierRow({ ...newSupplierRow, supplier: selectedSupplier });
  };

  const totalHargaStock = selectedCards.reduce((total, currentItem) => {
    const itemCost = parseInt(currentItem.qty) * parseInt(currentItem.harga);
    return total + itemCost;
  }, 0);

  const totalHargaJob = listJob.reduce((total, currentItem) => {
    const itemCost = parseInt(currentItem.qty) * parseInt(currentItem.harga);
    return total + itemCost;
  }, 0);

  const handleDeleteImage = (index) => {
    setSelectedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };
  const handleQtyChange = (id, newQty) => {
    if (!isNaN(newQty)) {
      setSelectedCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, qty: newQty } : card)));
    } else {
      setSelectedCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, qty: '' } : card)));
    }
  };

  const handleHargaChange = (id, newHarga) => {
    if (!isNaN(newHarga)) {
      setSelectedCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, harga: newHarga } : card)));
    } else {
      setSelectedCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, harga: '' } : card)));
    }
  };

  const handleUpahChange = (id, newUpah) => {
    if (!isNaN(newUpah)) {
      setListTukang((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, upah: newUpah } : card)));
    } else {
      setListTukang((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, upah: '' } : card)));
    }
  };

  const mutation = useMutation({
    mutationFn: (formData) => {
      return addProject(formData);
    },
    onSuccess: () => {
      toast.success('Project Berhasil diajukan');
      navigate('/dashboard/app');
    },
    onError: () => {
      toast.error('Project tidak dapat diajukan');
    },
  });

  const handleAddNewProject = async (e) => {
    e.preventDefault();
    const totalHarga = parseInt(totalHargaJob) + totalHargaStock;
    const dataUser = JSON.parse(localStorage.getItem('dataUser'));
    const id = dataUser?.id;
    const tukangIdArray = listTukang.map((item) => {
      return item.id;
    });

    const tukangId = tukangIdArray.join(',');
    const formData = new FormData();
    formData.append('nama_project', project);
    formData.append('lokasi', selectedOption);
    formData.append('harga', parseInt(totalHarga));
    formData.append('start', startDate);
    formData.append('end', endDate);
    formData.append('status', 'Request');
    formData.append('tukangId', tukangId);
    formData.append('type', selectKerjaan);
    formData.append('userId', id);
    formData.append('approvalType', 'Admin Project');
    formData.append('Beli', 'Beli');
    formData.append('list_job', JSON.stringify(listJob));
    formData.append('list_stock', JSON.stringify(selectedCards));
    [...selectedImages].forEach((image) => {
      formData.append('list_gambar', image);
    });
    formData.append('list_tukang', JSON.stringify(listTukang));

    mutation.mutateAsync(formData);
  };
  const getStock = async () => {
    try {
      const response = await Axios.get('/stock/allstock');
      if (response.data.message === 'OK') {
        const data = response?.data?.data;
        setAllStock(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStock();
  }, []);
  const checkingStock = (item) => {
    console.log({ item });
    const listStock = allStock.find((find) => find.id === item.stockId);
    if (listStock?.qty === item.qty || listStock?.qty > item.qty) {
      return 'Stock masih ada';
    } else if (listStock?.qty < item.qty) {
      return 'Beli';
    }
    const listStock2 = allStock.find((find) => find.id === item.id);
    if (listStock2?.qty === item.qty || listStock2?.qty > item.qty) {
      return 'Stock masih ada';
    } else if (!listStock2 || listStock2?.qty < item.qty) {
      return 'Beli';
    }
  };
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Box
        sx={{
          py: 2,
          px: 2,
        }}
      >
        <Grid container flexDirection={'row'} display={'flex'} spacing={2} alignContent={'center'}>
          <Grid container spacing={4} sx={{ alignItems: 'center', mb: 3 }} lg={12}>
            <Grid item lg={12} md={2}>
              <form encType="multipart/form-data">
                <input
                  id="file-upload"
                  type="file"
                  name="list_gambar"
                  multiple
                  accept=".jpg, .jpeg, .png"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </form>
              <label htmlFor="file-upload" id="file-upload-label" style={{ cursor: 'pointer' }}>
                <Box
                  component="div"
                  sx={{
                    width: '100%',
                    height: '153.2px',
                    borderRadius: '20px',
                    backgroundColor: '#EFEDED',
                    '&:hover': {
                      opacity: [0.9, 0.8, 0.7],
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h6" component="h2" sx={{ color: '#000000', textAlign: 'center' }}>
                    Upload Lampiran
                  </Typography>
                </Box>
              </label>
            </Grid>
            {selectedImages.length > 0 && (
              <Grid item lg={12} md={2}>
                <Typography variant="body1" component="div" sx={{ color: '#000000', marginBottom: '16px' }}>
                  Lampiran :
                </Typography>
                <Stack direction="row" spacing={2} display="flex">
                  {selectedImages.map((image, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                      <img src={URL.createObjectURL(image)} alt={`Image ${index}`} width="auto" height="200" />
                      <Button
                        variant="outlined"
                        color="error"
                        label={'Delete'}
                        onClick={() => handleDeleteImage(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </Stack>
              </Grid>
            )}

            <Grid item lg={6} md={2}>
              <TextField
                id="outlined"
                label="Nama Project"
                fullWidth
                value={project}
                onChange={(event) => setProject(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={optionsKerjaan}
                onChange={(event, newValue) => {
                  setSelectKerjaan(newValue);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Tipe Pengerjaan" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Lokasi" />}
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

            <Grid item xs={12} sm={6} md={3} lg={12}>
              <Typography variant="h5" component="h5" sx={{ color: '#000000' }}>
                Tukang yang akan mengerjakan {project}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <Button
                label={'Check Tukang'}
                color={'color'}
                variant={'contained'}
                onClick={() => setIsAddModalTukang(true)}
              ></Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#ID</TableCell>
                      <TableCell>Nama Tukang</TableCell>
                      <TableCell>No Hp</TableCell>
                      <TableCell>Upah</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listTukang.map((item, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.nama_tukang}</TableCell>
                        <TableCell>{item.no_hp}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            type="number"
                            value={item.upah}
                            onChange={(e) => handleUpahChange(item.id, parseInt(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            label={'Hapus'}
                            onClick={() => handleDeleteTukang(item.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={12}>
              <Typography variant="h5" component="h5" sx={{ color: '#000000' }}>
                Estimasi Bahan untuk {project}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <Button
                label={'Check Stock'}
                color={'color'}
                variant={'contained'}
                onClick={() => setIsAddModalOpen(true)}
              ></Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#ID</TableCell>
                      <TableCell>Nama Barang</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Harga</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Keterangan</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCards.map((item, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.nama_barang}</TableCell>
                        <TableCell>{item.supplier?.nama_supplier}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            fullWidth
                            type="number"
                            value={item.harga}
                            onChange={(e) => handleHargaChange(item.id, parseInt(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          {currency(
                            isNaN(parseInt(item.qty) * parseInt(item.harga))
                              ? 0
                              : parseInt(item.qty) * parseInt(item.harga)
                          )}
                        </TableCell>
                        <TableCell>{checkingStock(item)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            label={'Hapus'}
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          error={stockError}
                          value={newSupplierRow.nama_barang}
                          onChange={(e) => setNewSupplierRow({ ...newSupplierRow, nama_barang: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        {newSupplierRow.supplier ? (
                          <Grid lg={12} direction={'row'} display={'flex'}>
                            <Grid lg={9}>
                              <TextField
                                size="small"
                                fullWidth
                                disabled
                                value={newSupplierRow.supplier.nama_supplier}
                                onChange={(e) => setNewSupplierRow({ ...newSupplierRow, supplier: e.target.value })}
                              />
                            </Grid>
                            <Grid lg={1}>
                              <Button
                                size={'sm'}
                                label={'X'}
                                color={'color'}
                                variant={'contained'}
                                onClick={() => setNewSupplierRow({ ...newSupplierRow, supplier: '' })}
                              />
                            </Grid>
                          </Grid>
                        ) : (
                          <Button
                            label={'Check'}
                            color={'color'}
                            size="md"
                            variant={'contained'}
                            onClick={() => setIsModalSupplier(true)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          error={stockError}
                          value={newSupplierRow.qty}
                          onChange={(e) => setNewSupplierRow({ ...newSupplierRow, qty: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          error={stockError}
                          value={newSupplierRow.harga}
                          onChange={(e) => setNewSupplierRow({ ...newSupplierRow, harga: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField size="small" fullWidth disabled value={newSupplierRow.qty * newSupplierRow.harga} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" color="color" label={'Add'} onClick={handleAddRow}></Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={12} justifyContent="flex-end">
              <Typography variant="h6" component="h6" sx={{ color: '#000000', textAlign: 'right' }}>
                Total Harga Rp. {currency(totalHargaStock)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={12}>
              <Typography variant="h5" component="h5" sx={{ color: '#000000' }}>
                Upah yang diperlukan untuk pengerjaan proyek {project}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>#ID</TableCell>
                      <TableCell>Nama Job</TableCell>
                      {selectKerjaan === 'Borongan' ? (
                        <>
                          <TableCell>Qty</TableCell>
                          <TableCell>Harga</TableCell>
                          <TableCell>Total</TableCell>
                        </>
                      ) : null}
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listJob.map((item, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        {selectKerjaan === 'Borongan' ? (
                          <>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{currency(item.harga)}</TableCell>
                            <TableCell>{currency(item.qty * item.harga)}</TableCell>
                          </>
                        ) : null}

                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            label={'Hapus'}
                            onClick={() => handleDeleteJob(item.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          error={jobError}
                          value={newJobRow.name}
                          onChange={(e) => setNewJobRow({ ...newJobRow, name: e.target.value })}
                        />
                      </TableCell>
                      {selectKerjaan === 'Borongan' ? (
                        <>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              error={jobError}
                              value={newJobRow.qty}
                              onChange={(e) => setNewJobRow({ ...newJobRow, qty: e.target.value })}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              error={jobError}
                              value={newJobRow.harga}
                              onChange={(e) => setNewJobRow({ ...newJobRow, harga: e.target.value })}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField size="small" fullWidth value={newJobRow.qty * newJobRow.harga} />
                          </TableCell>
                        </>
                      ) : null}
                      <TableCell>
                        <Button variant="outlined" color="color" label={'Add'} onClick={handleAddJobRow}></Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={12} justifyContent="flex-end">
              <Typography variant="h6" component="h6" sx={{ color: '#000000', textAlign: 'right' }}>
                Total Harga Rp. {currency(totalHargaJob)}
              </Typography>
            </Grid>
            <Grid lg={6} />
            <Grid item xs={12} sm={6} md={3} lg={6}>
              <TableContainer component={Paper}>
                <Table sx={{ border: '1px solid #ccc' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h5" component="h5" sx={{ color: '#000000' }}>
                          Summary
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5" component="h5" sx={{ color: '#000000' }}>
                          Total
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6" component="h6" sx={{ color: '#000000' }}>
                          Bahan
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" component="h6" sx={{ color: '#000000' }}>
                          Rp. {currency(totalHargaStock)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6" component="h6" sx={{ color: '#000000' }}>
                          Upah
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" component="h6" sx={{ color: '#000000' }}>
                          Rp. {currency(totalHargaJob)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6" component="h6" sx={{ color: '#000000' }}>
                          Total
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" component="h6" sx={{ color: '#000000' }}>
                          Rp. {currency(totalHargaJob + totalHargaStock)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid lg={4} />
            <Grid item lg={4}>
              <Button label={'Cancel'} size={'lg'} variant={'outlined'} color={'color'} />
            </Grid>

            <Grid item lg={4}>
              <Button
                label={'Ajukan'}
                size={'lg'}
                variant={'contained'}
                color={'color'}
                onClick={handleAddNewProject}
              />
            </Grid>
          </Grid>
        </Grid>

        <ModalComponent open={addModalOpen} close={() => setIsAddModalOpen(false)} title={'Check Stock'}>
          <ModalCheckStock
            onClick={() => setIsAddModalOpen(false)}
            onSelectedItems={handleSelectedItems}
            selectedItems={selectedCards}
          />
        </ModalComponent>
        <ModalComponent open={isModalSupplier} close={() => setIsModalSupplier(false)} title={'Check Supplier'}>
          <ModalCheckSupplier onClick={() => setIsModalSupplier(false)} onSelectedItems={handleSelectedSupplier} />
        </ModalComponent>
        <ModalComponent open={isModalTukang} close={() => setIsAddModalTukang(false)} title={'Check Tukang'}>
          <ModalCheckTukang
            onClick={() => setIsAddModalTukang(false)}
            onSelectedItems={handleSelectedTukang}
            selectedItems={listTukang}
          />
        </ModalComponent>
      </Box>
    </>
  );
}
