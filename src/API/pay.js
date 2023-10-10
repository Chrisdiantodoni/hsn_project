import { Axios } from '../utils';

export const getPay = async (search, page, size, status_project, startDate, endDate) => {
  const params = {
    status: status_project,
    query: search,
    start: startDate,
    end: endDate,
    size: size,
    page: page,
  };

  try {
    const response = await Axios.get('/pay', {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
