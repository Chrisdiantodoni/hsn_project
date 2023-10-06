import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
// @mui
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme, styled } from '@mui/material/styles';
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
  const [tukangTimes, setTukangTimes] = useState({});
  const [totalUpahPerTukang, setTotalUpahPerTukang] = useState({});
  const getProgress = async () => {
    try {
      const response = await Axios.get(`/progress/${id}`);
      if (response.data.message === 'OK') {
        setDataProject(response?.data?.data);

        const tukangTimesData = {};
        response?.data?.data?.list_tukangs?.forEach((tukang) => {
          tukangTimesData[tukang.id] = tukang.tukang_times;
        });

        setTukangTimes(tukangTimesData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProgress();
  }, []);

  const addTimeEntry = (tukangId) => {
    const newTimeEntry = {
      check_in: null,
      check_out: null,
      tanggal_masuk: null,
    };

    setTukangTimes((prevTimes) => ({
      ...prevTimes,
      [tukangId]: [...(prevTimes[tukangId] || []), newTimeEntry],
    }));
  };

  const handleDeleteTimeEntry = (tukangId, index) => {
    const updatedTimes = [...tukangTimes[tukangId]];
    updatedTimes.splice(index, 1);

    setTukangTimes((prevTimes) => ({
      ...prevTimes,
      [tukangId]: updatedTimes,
    }));
  };

  const handleTimePickerChange = (tukangId, fieldName, newValue, dataIndex) => {
    const updatedTimes = [...tukangTimes[tukangId]];
    updatedTimes[dataIndex] = {
      ...updatedTimes[dataIndex],
      [fieldName]: newValue,
    };

    setTukangTimes((prevTimes) => ({
      ...prevTimes,
      [tukangId]: updatedTimes,
    }));
  };

  const handleHitunganUpah = (check_in, tukangId) => {
    const checkIn = moment(check_in);
    const checkInHour = checkIn.hours();
    const hourlyRate = parseFloat(dataProject?.list_tukangs?.find((tukang) => tukang.id === tukangId)?.upah || 0);
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
    const hourlyRate = parseFloat(dataProject?.list_tukangs?.find((tukang) => tukang.id === tukangId)?.upah || 0);

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

    dataProject?.list_tukangs?.forEach((tukang) => {
      const tukangId = tukang.id;
      const totalUpahForTukang = handleTotalUpah(tukangId);
      totalUpahForAllTukangs += totalUpahForTukang;
    });

    return totalUpahForAllTukangs;
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
        <Grid container spacing={2}>
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
            <Grid container spacing={3}>
              {dataProject?.list_tukangs?.map((item) => (
                <Grid item lg={12} key={item.id}>
                  <Grid container>
                    <Grid item lg={6}>
                      <TextField id="outlined" label="Nama Tukang" size="large" value={item?.nama_tukang} disabled />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField id="outlined" label="Upah Tukang" size="large" value={currency(item?.upah)} disabled />
                    </Grid>
                  </Grid>
                  <Divider
                    flexItem
                    sx={{
                      my: 2,
                    }}
                  />
                  <Grid container>
                    <Grid item lg={4} sx={{ py: 1 }}>
                      <Button
                        variant="contained"
                        color="color"
                        label={'Tambah Waktu'}
                        onClick={() => addTimeEntry(item.id)}
                      >
                        Tambah Waktu
                      </Button>
                    </Grid>

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
                              <>
                                <TableRow key={timeIndex}>
                                  <TableCell>
                                    <DatePicker
                                      value={moment(timeItem?.tanggal_masuk)}
                                      onChange={(newValue) =>
                                        handleTimePickerChange(item.id, 'tanggal_masuk', newValue, timeIndex)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <MobileTimePicker
                                      value={moment(timeItem.check_in) || null}
                                      onChange={(newValue) =>
                                        handleTimePickerChange(item.id, 'check_in', newValue, timeIndex)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <MobileTimePicker
                                      value={moment(timeItem.check_out) || null}
                                      onChange={(newValue) =>
                                        handleTimePickerChange(item.id, 'check_out', newValue, timeIndex)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      disabled
                                      value={currency(handleHitunganUpah(timeItem.check_in, item.id))}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      label={'Hapus'}
                                      onClick={() => handleDeleteTimeEntry(item.id, timeIndex)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </>
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
            <Button variant="contained" color="color" size="large" fullWidth>
              AJUKAN PEMBAYARAN
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
