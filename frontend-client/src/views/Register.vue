<template>
  <div class="lux-shell flex min-h-screen items-center justify-center px-4 py-12">
    <div class="max-w-5xl w-full grid gap-8 lg:grid-cols-2 glass-card p-8 border-white/10">
      <div class="hidden lg:block">
        <div class="h-full rounded-3xl bg-gradient-to-br from-amber-300/20 via-white/5 to-emerald-300/20 p-8 shadow-2xl">
          <div class="space-y-6 text-white">
            <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-50">Premium Access</p>
            <h2 class="text-3xl font-extrabold leading-tight">ยกระดับประสบการณ์เช่าระดับ Luxury</h2>
            <p class="text-slate-200">รับสิทธิ์ Concierge, แจ้งเตือนอัจฉริยะ และแดชบอร์ดสไตล์เอ็นเตอร์ไพรส์ทันทีที่สมัคร</p>
            <ul class="space-y-3 text-sm text-amber-50/90">
              <li class="flex items-center space-x-3"><span class="h-2 w-2 rounded-full bg-amber-300"></span><span>ดีลสมาชิกพิเศษทุกสัปดาห์</span></li>
              <li class="flex items-center space-x-3"><span class="h-2 w-2 rounded-full bg-emerald-300"></span><span>การยืนยันตัวตนปลอดภัย</span></li>
              <li class="flex items-center space-x-3"><span class="h-2 w-2 rounded-full bg-sky-300"></span><span>จัดการคำสั่งเช่าผ่านแดชบอร์ดเดียว</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="space-y-2">
          <p class="text-sm uppercase tracking-[0.3em] text-amber-200">Create Account</p>
          <h1 class="text-3xl font-bold text-white">สมัครสมาชิก</h1>
          <p class="text-slate-300">เริ่มต้นใช้งานระบบเช่ายืมระดับไฮเอนด์ พร้อม UX ที่ออกแบบมาสำหรับผู้ใช้จริง</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">ชื่อ</label>
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-200">นามสกุล</label>
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">อีเมล</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">เบอร์โทรศัพท์</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-200">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
            />
          </div>

          <div v-if="error" class="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="primary-btn w-full justify-center"
          >
            {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-300">
          มีบัญชีอยู่แล้ว?
          <router-link to="/login" class="text-amber-200">เข้าสู่ระบบ</router-link>
        </p>
      </div>
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
  firstName: '',
  lastName: '',
  phone: '',
});

const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.register(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
  } finally {
    loading.value = false;
  }
};
</script>
