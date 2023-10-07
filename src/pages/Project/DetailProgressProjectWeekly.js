import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
// @mui
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Grid,
  Container,
  Typography,
  Paper,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  Box,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import { DatePicker, TimePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { Axios, currency } from 'src/utils';
import { Button } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function DetailProjectProgress() {
  const { id } = useParams();
  const [dataProject, setDataProject] = useState({});
  const [percentage, setPercentage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [historyPay, setHistoryPay] = useState([]);
  const [percentageArray, setPercentageArray] = useState([]);
  const getProgress = async () => {
    try {
      const response = await Axios.get(`/progress/${id}`);
      if (response.data.message === 'OK') {
        setDataProject(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalUpahForAllTukangs = () => {
    const totalUpah = dataProject?.list_jobs?.reduce((total, item) => {
      const itemHarga = item.harga * item.qty * (percentage / 100);
      return total + itemHarga;
    }, 0);

    return totalUpah;
  };

  useEffect(() => {
    getProgress();
  }, []);
  useEffect(() => {
    if (dataProject.list_jobs) {
      const defaultPercentages = dataProject.list_jobs.map(() => '');
      setPercentageArray(defaultPercentages);
    }
  }, [dataProject]);
  const handleImageUpload = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const newImages = [...uploadedImages];

      for (let i = 0; i < files.length; i++) {
        newImages.push(files[i]);
      }

      setUploadedImages(newImages);
    }
  };
  const handleDeleteImage = (indexToDelete) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToDelete);
    setUploadedImages(newImages);
  };

  const handlePayment = () => {
    try {
      const paymentDataArray = dataProject?.list_jobs.map((progress) => {
        const percentageResult = percentageArray[progress.id] / 100;
        const totalPayment = percentageResult * progress.qty * progress.harga;
        const paymentData = {
          name: progress.name,
          qty: progress.qty,
          nominal: totalPayment,
          harga: progress.harga,
          percentage: percentageResult,
          hasil_akhir: percentageArray[progress.id] === 1 ? 'selesai' : 'belum selesai',
        };
        return paymentData;
      });
      const formData = new FormData();
      formData.append('tukangId', dataProject?.tukangId);
      formData.append('projectId', id);
      formData.append('approvalType', 'Accounting');
      [...uploadedImages].forEach((image) => {
        formData.append('list_image', image);
      });
      formData.append('list_progress', JSON.stringify(paymentDataArray));
      Axios.post('/progress/weekly', formData, {
        headers: {
          'Content-Type': 'multipart-form-data',
        },
      })
        .then((res) => {
          if (res) {
            toast.success('Pembayaran berhasil diajukan');
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error('Pembayaran gagal diajukan');
        });
    } catch (error) {
      console.log(error);
      toast.error('Tidak dapat mengajukan pembayaran');
    }
  };

  const handlePercentageChange = (index, newQty) => {
    if (!isNaN(newQty)) {
      setPercentageArray((prevPercentageArray) =>
        prevPercentageArray.map((value, i) => (i === index ? newQty : value === '' ? 0 : value))
      );
    } else {
      setPercentageArray((prevPercentageArray) => prevPercentageArray.map((value, i) => (i === index ? '' : value)));
    }
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Box
        sx={{
          mx: 2,
          py: 2,
        }}
      >
        <Grid container spacing={10}>
          <Grid item lg={12} md={2}>
            <form encType="multipart/form-data">
              <input
                id="file-upload"
                type="file"
                name="list_gambar"
                multiple
                accept=".jpg, .jpeg, .png"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
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
        </Grid>
        {uploadedImages.length > 0 && (
          <Grid item lg={12} md={2}>
            <Typography variant="body1" component="div" sx={{ color: '#000000', marginBottom: '16px' }}>
              Lampiran:
            </Typography>
            <Grid container spacing={2}>
              {uploadedImages.map((image, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={URL.createObjectURL(image)} alt={`Image ${index}`} width="auto" height="200" />
                  <Button variant="outlined" color="error" label={'Delete'} onClick={() => handleDeleteImage(index)}>
                    Delete
                  </Button>
                </div>
              ))}
            </Grid>
          </Grid>
        )}
        <Grid
          container
          spacing={2}
          sx={{
            mt: 2,
          }}
        >
          <Grid item lg={3}>
            <TextField
              id="outlined"
              label="Lokasi"
              size="large"
              fullWidth
              disabled
              value={dataProject?.lokasi}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item lg={3} />
          <Grid item lg={3} />
          <Grid item lg={3}>
            <TextField id="outlined" label="Periode" size="large" value={moment().format('DD MMM YYYY')} disabled />
          </Grid>
          <Grid item lg={3}>
            <TextField
              id="outlined"
              label="Tipe Pekerjaan"
              fullWidth
              size="large"
              value={dataProject?.type}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item lg={12}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              HISTORY PEMBAYARAN DAN PROGRESS PEKERJAAN
            </Typography>
          </Grid>
          <Grid item lg={12}>
            <TableContainer component={Paper} sx={{ minWidth: 650, border: '1px solid #ccc' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>PENGERJAAN</TableCell>
                    <TableCell>PROGRESS</TableCell>
                    <TableCell>TOTAL</TableCell>
                    <TableCell>KETERANGAN</TableCell>
                    <TableCell>TOTAL YANG DIBAYARKAN</TableCell>
                    <TableCell>TOTAL YANG SUDAH DIBAYARKAN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyPay?.map((item, idx) => (
                    <TableRow>
                      <TableCell width={'10%'}>
                        <Typography>{idx + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{item.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          <TextField
                            label={'%PROGRESS'}
                            type="number"
                            value={percentageArray[idx] || ''}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value, 10);
                              if (!isNaN(newValue) && newValue <= 100) {
                                handlePercentageChange(idx, newValue);
                              } else if (e.target.value === '') {
                                handlePercentageChange(idx, '');
                              }
                            }}
                          ></TextField>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency(item.harga)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency(item.qty)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          {parseInt(percentageArray[idx] || 0) === 100 ? 'Selesai' : 'Belum Selesai'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency((item.harga * item.qty * percentage) / 100)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item lg={12}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              RINCIAN PEKERJAAN TUKANG DAN PROGRESS
            </Typography>
          </Grid>
          <Grid item lg={12}>
            <TableContainer component={Paper} sx={{ minWidth: 650, border: '1px solid #ccc' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>PENGERJAAN</TableCell>
                    <TableCell>PROGRESS</TableCell>
                    <TableCell>QTY</TableCell>
                    <TableCell>@</TableCell>
                    <TableCell>TOTAL</TableCell>
                    <TableCell>KETERANGAN</TableCell>
                    <TableCell>TOTAL YANG DIBAYARKAN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataProject?.list_jobs?.map((item, idx) => (
                    <TableRow>
                      <TableCell width={'10%'}>
                        <Typography>{idx + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{item.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>
                          <TextField
                            label={'%PROGRESS'}
                            type="number"
                            value={percentageArray[idx] || ''}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value, 10);
                              if (!isNaN(newValue) && newValue <= 100) {
                                handlePercentageChange(idx, newValue);
                              } else if (e.target.value === '') {
                                handlePercentageChange(idx, '');
                              }
                            }}
                          ></TextField>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency(item.qty)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency(item.harga)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency(item.harga * item.qty)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{parseInt(percentageArray[idx]) === 100 ? 'Selesai' : 'Belum Selesai'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{currency(item.harga * item.qty * (percentageArray[idx] / 100))}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item lg={6}>
            <TableContainer component={Paper} sx={{ minWidth: 650, border: '1px solid #ccc' }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>NAMA TUKANG</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataProject.list_tukangs?.map((item) => (
                  <TableRow>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nama_tukang}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
          </Grid>

          <Grid item lg={4} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              ESTIMASI PEKERJAAN
            </Typography>
          </Grid>
          <Grid item lg={2} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              Rp. {currency(calculateTotalUpahForAllTukangs())}
            </Typography>
          </Grid>
          <Grid item lg={3} />
          <Grid item lg={3} />
          <Grid item lg={4} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              TOTAL YANG SUDAH DIBAYARKAN DIBAYARKAN
            </Typography>
          </Grid>
          <Grid item lg={2} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              Rp. {currency(200000000000)}
            </Typography>
          </Grid>
          <Grid item lg={3} />
          <Grid item lg={3} />
          <Grid item lg={4} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              TOTAL PEMBAYARAN MINGGU INI
            </Typography>
          </Grid>
          <Grid item lg={2} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              Rp. {currency(200000000000)}
            </Typography>
          </Grid>
          <Grid item lg={5} />
          <Grid item lg={5} />
          <Grid item lg={2} sx={{ py: 2 }}>
            <Button variant="contained" color="color" size="large" fullWidth onClick={handlePayment}>
              AJUKAN PEMBAYARAN
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
