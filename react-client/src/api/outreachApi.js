import { apiClient } from './client';

export const outreachApi = {
  updateStatus: (id, status) =>
    apiClient(`/customers/${id}/outreach/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
