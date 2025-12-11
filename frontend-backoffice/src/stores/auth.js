import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { authAPI } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const admin = ref(JSON.parse(localStorage.getItem('admin') || 'null'));
  const token = ref(localStorage.getItem('adminToken') || '');

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    try {
      const response = await authAPI.adminLogin(credentials);
      admin.value = response.data.admin;
      token.value = response.data.token;
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      localStorage.setItem('adminToken', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    admin.value = null;
    token.value = '';
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  }

  return { admin, token, isAuthenticated, login, logout };
});
