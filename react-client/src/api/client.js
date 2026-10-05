import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const apiClient = async (endpoint, options = {}) => {
  try {
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Django server connectivity error.';
    throw new Error(errorMsg);
  }
};
