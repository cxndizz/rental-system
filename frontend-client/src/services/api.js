import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8852';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Users APIs
export const usersAPI = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (id, data) => api.put(`/users/profile/${id}`, data),
  submitKYC: (id, data) => api.post(`/users/kyc/${id}`, data),
  getKYC: (id) => api.get(`/users/kyc/${id}`),
  createAddress: (userId, data) => api.post(`/users/addresses/${userId}`, data),
  getAddresses: (userId) => api.get(`/users/addresses/${userId}`),
};

// Items APIs
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  getCategories: () => api.get('/items/categories/all'),
  getTags: () => api.get('/items/tags/all'),
};

// Rentals APIs
export const rentalsAPI = {
  create: (data) => api.post('/rentals', data),
  getUserRentals: (userId, params) => api.get(`/rentals/user/${userId}`, { params }),
  getById: (id) => api.get(`/rentals/${id}`),
  getOverdue: () => api.get('/rentals/overdue/all'),
};

// Returns APIs
export const returnsAPI = {
  create: (rentalOrderId) => api.post(`/returns/${rentalOrderId}`),
  getPending: () => api.get('/returns/pending'),
};

// Payments APIs
export const paymentsAPI = {
  createInvoice: (rentalOrderId) => api.post(`/payments/invoice/${rentalOrderId}`),
  createTransaction: (data) => api.post('/payments/transaction', data),
  getInvoice: (id) => api.get(`/payments/invoice/${id}`),
};

// Reviews APIs
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getItemReviews: (itemId, params) => api.get(`/reviews/item/${itemId}`, { params }),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

// Notifications APIs
export const notificationsAPI = {
  getUserNotifications: (userId) => api.get(`/notifications/user/${userId}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Promotions APIs
export const promotionsAPI = {
  getActive: () => api.get('/promotions'),
  validateCoupon: (code) => api.get(`/promotions/coupons/${code}`),
};

export default api;
