import { ENDPOINTS } from '../constants/api';
import api from '.';

export const loginUser = async (username, password) => {
  const response = await api.post(ENDPOINTS.AUTH_LOCAL, {
      identifier: username,
      password,
  });

  return response.data;
};