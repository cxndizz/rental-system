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
    const token = localStorage.getItem('adminToken');
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
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  adminLogin: (data) => api.post('/auth/admin/login', data),
};

// Users APIs
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (id, data) => api.put(`/users/profile/${id}`, data),
  verifyKYC: (id, data) => api.put(`/users/kyc/${id}`, data),
};

// Items APIs
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getCategories: () => api.get('/items/categories/all'),
  createCategory: (data) => api.post('/items/categories', data),
  getTags: () => api.get('/items/tags/all'),
  createTag: (data) => api.post('/items/tags', data),
  addMedia: (id, data) => api.post(`/items/${id}/media`, data),
};

// Rentals APIs
export const rentalsAPI = {
  getAll: (params) => api.get('/rentals', { params }),
  getById: (id) => api.get(`/rentals/${id}`),
  updateStatus: (id, data) => api.put(`/rentals/${id}/status`, data),
  getOverdue: () => api.get('/rentals/overdue/all'),
};

// Returns APIs
export const returnsAPI = {
  getPending: () => api.get('/returns/pending'),
  inspect: (id, data) => api.put(`/returns/${id}/inspect`, data),
  reportDamage: (id, data) => api.post(`/returns/${id}/damage`, data),
};

// Payments APIs
export const paymentsAPI = {
  getInvoice: (id) => api.get(`/payments/invoice/${id}`),
  refund: (invoiceId, data) => api.post(`/payments/refund/${invoiceId}`, data),
};

// Promotions APIs
export const promotionsAPI = {
  getAll: () => api.get('/promotions'),
  create: (data) => api.post('/promotions', data),
  createCoupon: (data) => api.post('/promotions/coupons', data),
  createCampaign: (data) => api.post('/promotions/campaigns', data),
};

// Notifications APIs
export const notificationsAPI = {
  send: (data) => api.post('/notifications', data),
  broadcast: (data) => api.post('/notifications/broadcast', data),
  createTemplate: (data) => api.post('/notifications/templates', data),
};

// Admin APIs
export const adminAPI = {
  createStaff: (data) => api.post('/admin/staff', data),
  getAllStaff: () => api.get('/admin/staff'),
  createRole: (data) => api.post('/admin/roles', data),
  getRoles: () => api.get('/admin/roles'),
  createPermission: (data) => api.post('/admin/permissions', data),
  getPermissions: () => api.get('/admin/permissions'),
};

// Reports APIs
export const reportsAPI = {
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getRentals: (params) => api.get('/reports/rentals', { params }),
  getItemUtilization: (params) => api.get('/reports/items', { params }),
  getCustomers: () => api.get('/reports/customers'),
  getDashboard: () => api.get('/reports/dashboard'),
};

// Config APIs
export const configAPI = {
  getAll: () => api.get('/config'),
  get: (key) => api.get(`/config/${key}`),
  update: (key, data) => api.put(`/config/${key}`, data),
};

// Audit APIs
export const auditAPI = {
  getLogs: (params) => api.get('/audit', { params }),
  createLog: (data) => api.post('/audit', data),
};

export default api;
