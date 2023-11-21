import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import { Button } from '..';
import { editUser, getUserDetail, resetPassword } from 'src/API/auth';
import { toast } from 'react-toastify';
import copy from 'clipboard-copy';

const ModalEditUser = ({ onClick, id }) => {
  const { handleSubmit, register, control } = useForm();
  const query = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleEditUser = (data) => {
    const updatedData = { ...data, roles: selectedRole };
    mutation.mutate(updatedData);
  };

  const handleResetPassword = (id) => {
    mutationResetPassword.mutateAsync(id);
  };

  const mutationResetPassword = useMutation({
    mutationFn: async (id) => {
      const result = await resetPassword(id);
      return result;
    },
    onSuccess: async (data) => {
      query.invalidateQueries({
        queryKey: ['users'],
      });
      toast.success('Password berhasil direset');
      await copy(data?.data?.password);
      onClick();
    },
    onError: () => {
      toast.error('Password Gagal direset');
    },
  });

  const mutation = useMutation({
    mutationFn: async (body) => {
      editUser(id, body);
    },
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ['users'],
      });
      toast.success('User berhasil diedit');
      onClick();
    },
    onError: () => {
      toast.error('User gagal diedit');
    },
  });

  const { isLoading, data, error, isSuccess } = useQuery({
    queryKey: ['user-detail', id],
    queryFn: async () => {
      const response = await getUserDetail(id);
      return response?.data;
    },
  });
  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (isSuccess) {
    const { nama_lengkap, email, roles } = data;

    const options = ['Accounting', 'Project Manager', 'Owner', 'Finance', 'Admin', 'Admin Project', 'Pembelian'];

    return (
      <Grid container spacing={5}>
        <Grid item xs={5} lg={6}>
          <TextField
            {...register('nama_lengkap')}
            required
            id="outlined-required"
            label="Nama"
            fullWidth
            defaultValue={nama_lengkap}
          />
        </Grid>
        <Grid item xs={5} lg={6}>
          <TextField
            required
            id="outlined-required"
            {...register('Email')}
            label="Email"
            fullWidth
            defaultValue={email}
          />
        </Grid>
        <Grid item xs={5} lg={6}>
          <Controller
            name="roles"
            control={control} //
            defaultValue={roles}
            render={({ field }) => (
              <Autocomplete
                getOptionLabel={(option) => option.toString()}
                {...field}
                isOptionEqualToValue={(option, value) => option.toString() === value.toString()}
                disablePortal
                id="combo-box-demo"
                options={options}
                renderInput={(params) => <TextField {...params} label="Roles" fullWidth />}
                onChange={(event, newValue) => {
                  console.log('Selected Value: ', newValue);
                  setSelectedRole(newValue);
                }}
              />
            )}
          />
        </Grid>

        <Grid lg={4} />
        <Grid item xs={5} lg={4}>
          <Button
            color="color"
            variant="outlined"
            label="RESET PASSWORD"
            size="large"
            onClick={() => handleResetPassword(id)}
          />
        </Grid>
        <Grid item xs={5} lg={4}>
          <Button
            color="color"
            variant="contained"
            label="SIMPAN"
            size="large"
            onClick={handleSubmit(handleEditUser)}
          />
        </Grid>
      </Grid>
    );
  }
};

export default ModalEditUser;
