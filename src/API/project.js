import { Axios } from '../utils';

export const getProject = async (search, page, size, status_project, startDate, endDate) => {
  const params = {
    query: `${search}`,
    status: status_project,
    start: startDate,
    end: endDate,
    size: size,
    page: page,
  };

  try {
    const response = await Axios.get('/project', {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProgress = async (search, page, size, startDate, endDate) => {
  const params = {
    query: search,
    start: startDate,
    end: endDate,
    size: size,
    page: page,
  };

  try {
    const response = await Axios.get('/progress', {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
