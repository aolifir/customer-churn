import { apiClient } from './client';

export const customersApi = {
  // Fetches the directory matching your http://127.0.0.1:8000/api/customers/ endpoint
  getAll: () => apiClient('/customers/'),

  // Fixes the broken lookup string from your old table handler
  getById: (id) => apiClient(`/customers/${id}/`),
};
