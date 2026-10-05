import { apiClient } from './client';

export const modelApi = {
  getInfo: () => apiClient('/model/info/'),
};
