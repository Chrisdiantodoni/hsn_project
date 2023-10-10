import { Axios } from '../utils';

export const getTukang = async (page, size, search) => {
  const params = {
    page,
    size,
    query: search,
  };
  try {
    const response = await Axios.get(`/tukang`, { params });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const addTukang = async (body) => {
  try {
    const response = await Axios.post('/tukang', body);
    return response.data;
  } catch (error) {
    return error;
  }
};
