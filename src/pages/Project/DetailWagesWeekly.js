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
  Stack,
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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [historyPay, setHistoryPay] = useState([]);
  const [percentageArray, setPercentageArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getProgress = async () => {
    try {
      const response = await Axios.get(`/pay/pay-weekly/${id}`);
      if (response.data.message === 'OK') {
        setDataProject(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryPay = async () => {
    try {
      const response = await Axios.get(`/pay/history/${dataProject?.project?.id}`);
      if (response.data.message == 'OK') {
        const data = response?.data?.data;
        setHistoryPay(data);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistoryPay();
  }, [dataProject]);

  const calculateTotalPaymentByIndex = (index) => {
    const payment = historyPay[index];

    if (!payment) {
      return 0;
    }

    return payment.pay_details.reduce((total, detail) => {
      return total + detail.nominal;
    }, 0);
  };

  const calculateTotalUpahForAllTukangs = () => {
    const totalUpah = dataProject?.list_jobs?.reduce((total, item, index) => {
      const percentage = parseFloat(percentageArray[index]?.percentage || '0');
      if (isNaN(percentage)) {
        return total;
      }
      const itemHarga = item.harga * item.qty * percentage;
      return total + itemHarga;
    }, 0);

    return totalUpah;
  };

  useEffect(() => {
    getProgress();
  }, []);
  useEffect(() => {
    if (dataProject.list_jobs) {
      const defaultPercentages = dataProject.list_jobs.map((item) => ({
        id: item.id,
        percentage: item.percentage || '',
      }));
      setPercentageArray(defaultPercentages, percentageArray);
    }
  }, [dataProject]);

  console.log(percentageArray);
  const handlePayment = () => {
    const dataUser = JSON.parse(localStorage.getItem('dataUser'));
    const roles = dataUser?.roles;

    const body = {
      comments: 'BLABLABLA',
      approvalType:
        roles === 'Project Manager'
          ? 'Admin Project'
          : roles === 'Admin Project'
          ? 'Accounting'
          : roles === 'Admin'
          ? 'Admin'
          : 'Finance',
      userId: dataUser?.id,
      status: 'approve',
    };
    Axios.put(`/pay/pay-weekly/${id}`, body)
      .then((res) => {
        if (res.data.message === 'OK') {
          toast.success('Pembayaran berhasil disetujui');
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    console.log(body);
  };

  const handleRincianPembayaran = () => {
    setIsModalOpen(true);
  };

  const calculateTotalAmountPaid = () => {
    let totalPaid = 0;

    historyPay.forEach((item, idx) => {
      const payment = calculateTotalPaymentByIndex(idx);
      totalPaid += payment;
    });

    return totalPaid;
  };

  const totalRemainingPayment = () => {
    const total = calculateTotalUpahForAllTukangs() - calculateTotalAmountPaid();
    return total;
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Box>
        <Stack>
          <Grid container>
            {uploadedImages.length > 0 && (
              <Grid item lg={12} md={2}>
                <Typography variant="body1" component="div" sx={{ color: '#000000', marginBottom: '16px' }}>
                  Lampiran:
                </Typography>
                <Grid container spacing={2}>
                  {uploadedImages.map((image, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                      <img src={URL.createObjectURL(image)} alt={`Image ${index}`} width="auto" height="200" />
                    </div>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
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
                value={dataProject?.project?.lokasi}
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
                value={dataProject?.project?.type}
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
                      <TableCell>TANGGAL PENGAJUAN</TableCell>
                      <TableCell>TOTAL YANG SUDAH DIBAYARKAN</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historyPay?.map((item, idx) => (
                      <TableRow>
                        <TableCell width={'10%'}>
                          <Typography>{idx + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{moment(item.createdAt).format('DD MMMM YYYY')}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{currency(item.total)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Button onClick={handleRincianPembayaran} color="color" variant="contained">
                            Lihat Rincian
                          </Button>
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
                      <TableCell>PERSENTASE PENGERJAAN</TableCell>
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
                          <Typography>{item.pay_detail?.percentage * 100}%</Typography>
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
                          <Typography>
                            {percentageArray.find((percentageObj) => percentageObj.id === item.id)?.percentage / 100 ===
                            1
                              ? 'Selesai'
                              : 'Belum Selesai'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{currency(item.harga * item.qty * item.pay_detail.percentage)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item lg={6}>
              <TableContainer component={Paper} sx={{ border: '1px solid #ccc' }}>
                <Table>
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
                </Table>
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
                TOTAL YANG SUDAH DIBAYARKAN
              </Typography>
            </Grid>
            <Grid item lg={2} sx={{ py: 2 }}>
              <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
                Rp. {currency(calculateTotalAmountPaid())}
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
                Rp. {currency(totalRemainingPayment())}
              </Typography>
            </Grid>
            <Grid item lg={5} />
            <Grid item lg={5} />
            <Grid item lg={2} sx={{ py: 2 }}>
              <Button variant="contained" color="color" size="large" fullWidth onClick={handlePayment}>
                APPROVE
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
