import { Axios } from 'src/utils';

export const getUser = async (page, size, search) => {
  const params = {
    page,
    size,
    query: search,
  };
  try {
    const response = await Axios.get('/auth', { params });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getUserDetail = async (id) => {
  try {
    const response = await Axios.get(`/auth/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const editUser = async (id, body) => {
  try {
    const response = await Axios.put(`/auth/update-user/${id}`, body);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const resetPassword = async (id) => {
  try {
    const response = await Axios.patch(`/auth/reset-password/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const changePassword = async (id) => {
  try {
    const response = await Axios.put(`/auth/update-password/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
