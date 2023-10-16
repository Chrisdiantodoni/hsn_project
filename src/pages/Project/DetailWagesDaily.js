import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
// @mui
import moment from 'moment';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
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
  Divider,
} from '@mui/material';
import { DatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { Axios, currency } from 'src/utils';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

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
  const [historyPay, setHistoryPay] = useState([]);
  const [tukangTimes, setTukangTimes] = useState({});
  const [totalUpahPerTukang, setTotalUpahPerTukang] = useState({});
  const [addedTimeEntries, setAddedTimeEntries] = useState({});
  const [comments, setComments] = useState('');

  const getProgress = async () => {
    try {
      const response = await Axios.get(`/pay/pay-daily/${id}`);
      if (response.data.message === 'OK') {
        setDataProject(response?.data?.data);
        const tukangTimesData = {};
        response?.data?.data?.list_tukang?.forEach((tukang) => {
          tukangTimesData[tukang.id] = tukang.tukang_times;
        });
        setTukangTimes(tukangTimesData);
        setUploadedImages(response?.data?.data.list_gambar);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getHistoryPay = async () => {
    try {
      const response = await Axios.get(`/pay/history/${dataProject?.projectId}`);
      if (response.data.message == 'OK') {
        const data = response.data;
        setHistoryPay(data);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProgress();
  }, []);

  useEffect(() => {
    getHistoryPay();
  }, []);

  console.log(addedTimeEntries);

  const handleHitunganUpah = (check_in, tukangId) => {
    const checkIn = moment(check_in);
    const checkInHour = checkIn.hours();
    const hourlyRate = dataProject?.list_tukang?.find((tukang) => tukang.id === tukangId)?.upah_tukangs[0]?.upah || 0;
    let paymentForEntry;

    if (checkInHour >= 12) {
      paymentForEntry = hourlyRate / 2;
    } else {
      paymentForEntry = hourlyRate;
    }

    return paymentForEntry;
  };

  const handleTotalUpah = (tukangId) => {
    const tukangTimeEntries = tukangTimes[tukangId] || [];
    const hourlyRate = dataProject?.list_tukang?.find((tukang) => tukang.id === tukangId)?.upah_tukangs[0]?.upah || 0;
    console.log(tukangTimeEntries, hourlyRate);
    const totalUpah = tukangTimeEntries.reduce((acc, timeEntry) => {
      const checkIn = moment(timeEntry.check_in);
      const checkInHour = checkIn.hours();
      let paymentForEntry;

      if (checkIn.isValid()) {
        if (checkInHour >= 12) {
          paymentForEntry = hourlyRate / 2;
        } else {
          paymentForEntry = hourlyRate;
        }

        acc += paymentForEntry;
      }

      return acc;
    }, 0);

    return totalUpah;
  };

  const calculateTotalUpahForAllTukangs = () => {
    let totalUpahForAllTukangs = 0;

    dataProject?.list_tukang?.forEach((tukang) => {
      const tukangId = tukang.id;
      const totalUpahForTukang = handleTotalUpah(tukangId);
      totalUpahForAllTukangs += totalUpahForTukang;
    });

    return totalUpahForAllTukangs;
  };

  const [uploadedImages, setUploadedImages] = useState([]);

  const handlePayment = () => {
    const dataUser = JSON.parse(localStorage.getItem('dataUser'));
    const roles = dataUser?.roles;

    const body = {
      comments: comments,
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
    Axios.put(`/pay/pay-daily/${id}`, body)
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

  const handlePayed = () => {};
  const handleRemainingPayment = () => {};

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
        {uploadedImages.length > 0 && (
          <Grid item lg={12} md={2}>
            <Typography variant="body1" component="div" sx={{ color: '#000000', marginBottom: '16px' }}>
              Lampiran:
            </Typography>
            <Grid container spacing={2}>
              {uploadedImages.map((image, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={image.file_name} alt={`Image ${index}`} width="auto" height="200" />
                </div>
              ))}
            </Grid>
          </Grid>
        )}
        <Grid container spacing={2}>
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
            <Grid container spacing={3}>
              {dataProject?.list_tukang?.map((item) => (
                <Grid item lg={12} key={item.id}>
                  <Grid container>
                    <Grid item lg={6}>
                      <TextField id="outlined" label="Nama Tukang" size="large" value={item?.nama_tukang} disabled />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        id="outlined"
                        label="Upah Tukang"
                        size="large"
                        value={currency(item?.upah_tukangs[0]?.upah)}
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Divider
                    flexItem
                    sx={{
                      my: 2,
                    }}
                  />
                  <Grid container>
                    <TableContainer component={Paper} sx={{ minWidth: 650, border: '1px solid #ccc' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tanggal Masuk</TableCell>
                            <TableCell>Check In</TableCell>
                            <TableCell>Check Out</TableCell>
                            <TableCell>Upah Per Hari</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(tukangTimes[item.id]) &&
                            tukangTimes[item.id].map((timeItem, timeIndex) => (
                              <TableRow key={timeIndex}>
                                <TableCell>
                                  <DatePicker value={moment(timeItem?.tanggal_masuk)} disabled={!!timeItem.id} />
                                </TableCell>
                                <TableCell>
                                  <MobileTimePicker
                                    value={moment(timeItem.check_in) || null}
                                    disabled={!!timeItem.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  <MobileTimePicker
                                    value={moment(timeItem.check_out) || null}
                                    disabled={!!timeItem.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    disabled
                                    value={currency(handleHitunganUpah(timeItem.check_in, item.id))}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          <TableRow>
                            <TableCell>
                              <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
                                Total Upah Untuk {item?.nama_tukang}
                              </Typography>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <TextField disabled value={currency(handleTotalUpah(item.id))} />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Divider
                    flexItem
                    sx={{
                      my: 2,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item lg={3} />
          <Grid item lg={3} />
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
              Rp. {currency(handlePayed())}
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
              Rp. {currency(handleRemainingPayment())}
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
      </Box>
    </>
  );
}
