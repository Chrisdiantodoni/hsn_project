import { Axios } from 'src/utils';

export const getSupplier = async (page, size, search) => {
  const params = {
    page,
    size,
    query: search,
  };
  try {
    const response = await Axios.get('/supplier', { params });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addSupplier = async (body) => {
  try {
    const response = await Axios.post('/supplier', body);
    return response.data;
  } catch (error) {
    return error;
  }
};
