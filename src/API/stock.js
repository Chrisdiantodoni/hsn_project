import { Axios } from 'src/utils';

export const getStock = async (page, size, search) => {
  const params = {
    page,
    size,
    query: search,
  };
  try {
    const response = await Axios.get('/stock', { params });
    return response.data;
  } catch (error) {
    return error;
  }
};
