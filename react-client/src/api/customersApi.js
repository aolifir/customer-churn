import { apiClient } from './client';

export const customersApi = {

  getAll: () => apiClient('/customers/'),

  getById: (id) => apiClient(`/customers/${id}/`),
};
