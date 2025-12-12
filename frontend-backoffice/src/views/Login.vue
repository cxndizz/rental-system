<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 text-slate-100">
    <div class="max-w-md w-full rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl p-10 space-y-8">
      <div class="text-center space-y-2">
        <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 text-slate-950 font-extrabold shadow-lg shadow-rose-500/30">
          R
        </div>
        <div>
          <h1 class="text-3xl font-semibold">Admin Panel</h1>
          <p class="text-slate-300">Rental System Management</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">อีเมล</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">รหัสผ่าน</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="bg-rose-500/15 text-rose-100 p-3 rounded-xl text-sm border border-rose-400/30">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 text-slate-950 py-3 rounded-xl font-semibold shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 transition disabled:opacity-70"
        >
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>
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
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
  } finally {
    loading.value = false;
  }
};
</script>
