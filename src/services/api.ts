import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, senha: string) => {
    const response = await api.post('/api/auth/login', { email, senha });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  validateToken: async () => {
    const response = await api.get('/api/auth/validate');
    return response.data;
  },

  updateProfile: async (userId: string, userData: any) => {
    const response = await api.put(`/api/auth/${userId}`, userData);
    return response.data;
  },
};

// Beer Services
export const beerService = {
  getPublicBeers: async () => {
    const response = await api.get('/api/beers/public');
    return response.data;
  },

  getAllBeers: async () => {
    const response = await api.get('/api/beers');
    return response.data;
  },

  createBeer: async (beerData: any) => {
    const response = await api.post('/api/beers', beerData);
    return response.data;
  },

  updateBeer: async (id: string, beerData: any) => {
    const response = await api.put(`/api/beers/${id}`, beerData);
    return response.data;
  },

  deleteBeer: async (id: string) => {
    const response = await api.delete(`/api/beers/${id}`);
    return response.data;
  },
};

// Order Services
export const orderService = {
  getMyOrders: async () => {
    const response = await api.get('/api/orders/myorders');
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.patch(`/api/orders/${id}`, { status });
    return response.data;
  },
};

// User Services (Admin)
export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.patch(`/api/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
};

// Payment Services
export const paymentService = {
  createPreference: async (items: any[], shippingAddress: any) => {
    const response = await api.post('/api/payments/create-preference', {
      items,
      shippingAddress,
    });
    return response.data;
  },
};

export default api;