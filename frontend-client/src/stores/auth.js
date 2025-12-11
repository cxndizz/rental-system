import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { authAPI } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token') || '');

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function register(data) {
    try {
      const response = await authAPI.register(data);
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return { user, token, isAuthenticated, login, register, logout };
});
