import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { DatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { Axios, currency } from 'src/utils';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';

export default function DetailProjectProgress() {
  const { id } = useParams();
  const [dataProject, setDataProject] = useState({});
  const [historyPay, setHistoryPay] = useState([]);
  const [tukangTimes, setTukangTimes] = useState({});
  const [addedTimeEntries, setAddedTimeEntries] = useState({});
  const [statusPenyelesaian, setStatusPenyelesaian] = useState('');

  const getProgress = async () => {
    try {
      const response = await Axios.get(`/progress/daily/${id}`);
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

  const getHistoryPay = async () => {
    try {
      const response = await Axios.get(`/pay/history/${id}`);
      if (response.data.message == 'OK') {
        const data = response.data?.data;
        setHistoryPay(data);
        console.log(data);
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

  const addTimeEntry = (tukangId) => {
    const newTimeEntry = {
      check_in: null,
      check_out: null,
      tanggal_masuk: null,
      tukangId: tukangId,
    };
    setTukangTimes((prevTimes) => ({
      ...prevTimes,
      [tukangId]: [...(prevTimes[tukangId] || []), newTimeEntry],
    }));
    setAddedTimeEntries((prevEntries) => ({
      ...prevEntries,
      [tukangId]: [...(prevEntries[tukangId] || []), newTimeEntry],
    }));
  };

  console.log(addedTimeEntries);

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
    setAddedTimeEntries((prevTimes) => ({
      ...prevTimes,
      [tukangId]: updatedTimes,
    }));
  };

  const handleHitunganUpah = (check_in, tukangId) => {
    const checkIn = moment(check_in);
    const checkInHour = checkIn.hours();
    const hourlyRate = parseFloat(
      dataProject?.list_tukangs?.find((tukang) => tukang.id === tukangId)?.upah_tukangs[0]?.upah || 0
    );
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
    const hourlyRate = dataProject?.list_tukangs?.find((tukang) => tukang.id === tukangId)?.upah_tukangs[0]?.upah || 0;
    console.log(tukangTimeEntries, hourlyRate);
    const totalUpah = tukangTimeEntries.reduce((acc, timeEntry) => {
      const checkIn = moment(timeEntry.check_in);
      const checkInHour = checkIn.hours();
      let paymentForEntry;

      if (checkIn.isValid() && !timeEntry.id) {
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
  const handlePayedTukang = (tukangId) => {
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
  const calculatePayedTukang = () => {
    let totalUpahForAllTukangs = 0;

    dataProject?.list_tukangs?.forEach((tukang) => {
      const tukangId = tukang.id;
      const totalUpahForTukang = handlePayedTukang(tukangId);
      totalUpahForAllTukangs += totalUpahForTukang;
    });

    return totalUpahForAllTukangs;
  };

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
  const navigate = useNavigate();
  const handleRincianPembayaran = (item) => {
    navigate(`/dashboard/paywages-daily/${item}`);
  };
  const [uploadedImages, setUploadedImages] = useState([]);

  const handlePayment = () => {
    const mergedData = Object.values(tukangTimes).reduce((mergedArray, timeEntries) => {
      const filteredTimeEntries = timeEntries.filter((entry) => entry && entry.id !== null);
      return mergedArray.concat(filteredTimeEntries);
    }, []);
    const filterList = mergedData.filter((item) => item.check_out !== null && !item.hasOwnProperty('id'));

    try {
      if (statusPenyelesaian !== '') {
        return toast.error('Inputan Status Penyelesaian masih kosong');
      } else if (uploadedImages.length === 0) {
        return toast.error('Gambar harus diupload');
      } else if (filterList.length === 0) {
        return toast.error('Jam harus ditetapkan');
      }
      const formData = new FormData();

      formData.append('tukangId', dataProject?.tukangId);
      formData.append('projectId', id);
      formData.append('total', calculateTotalUpahForAllTukangs());
      formData.append('status', 'Belum');
      formData.append('status_penyelesaian', statusPenyelesaian);

      formData.append('list_time', JSON.stringify(filterList));
      [...uploadedImages].forEach((image) => {
        formData.append('list_image', image);
      });

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      Axios.post('/progress/daily', formData, {
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
          <Grid item lg={12} md={2} mb={3}>
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
          <Grid item lg={6} />

          <Grid item lg={3}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status Penyelesaian</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={statusPenyelesaian}
                label="Status Penyelesaian"
                onChange={(e) => setStatusPenyelesaian(e.target.value)}
              >
                <MenuItem value={'Selesai'}>Sudah selesai</MenuItem>
                <MenuItem value={'Belum Selesai'}>Belum selesai</MenuItem>
              </Select>
            </FormControl>
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
                        <Button onClick={() => handleRincianPembayaran(item.id)} color="color" variant="contained">
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
            <Grid container spacing={3}>
              {dataProject?.list_tukangs?.map((item) => (
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
                              <TableRow key={timeIndex}>
                                <TableCell>
                                  <DatePicker
                                    value={moment(timeItem?.tanggal_masuk)}
                                    onChange={(newValue) =>
                                      handleTimePickerChange(item.id, 'tanggal_masuk', newValue, timeIndex)
                                    }
                                    disabled={!!timeItem.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  <MobileTimePicker
                                    value={moment(timeItem.check_in) || null}
                                    onChange={(newValue) =>
                                      handleTimePickerChange(item.id, 'check_in', newValue, timeIndex)
                                    }
                                    disabled={!!timeItem.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  <MobileTimePicker
                                    value={moment(timeItem.check_out) || null}
                                    onChange={(newValue) =>
                                      handleTimePickerChange(item.id, 'check_out', newValue, timeIndex)
                                    }
                                    disabled={!!timeItem.id}
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
                                    disabled={!!timeItem.id}
                                  >
                                    Delete
                                  </Button>
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
              TOTAL YANG SUDAH DIBAYARKAN
            </Typography>
          </Grid>
          <Grid item lg={2} sx={{ py: 2 }}>
            <Typography variant="p" component="p" sx={{ color: '#000000', fontSize: 20 }}>
              Rp. {currency(calculatePayedTukang())}
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
              Rp. {currency(calculateTotalUpahForAllTukangs() - calculatePayedTukang())}
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
