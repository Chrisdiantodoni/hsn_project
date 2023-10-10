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
