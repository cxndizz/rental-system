<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center mb-8">เข้าสู่ระบบ</h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <p class="text-center text-gray-600 mt-6">
        ยังไม่มีบัญชี?
        <router-link to="/register" class="text-blue-600 hover:underline font-semibold">
          สมัครสมาชิก
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
  } finally {
    loading.value = false;
  }
};
</script>
