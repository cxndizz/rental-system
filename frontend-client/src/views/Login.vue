<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-10">
    <div class="glass-card w-full max-w-4xl overflow-hidden border-white/10 shadow-2xl lg:grid lg:grid-cols-2">
      <div class="relative hidden bg-gradient-to-br from-amber-300/30 via-slate-800 to-slate-900 p-10 lg:block">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_30%)]"></div>
        <div class="relative space-y-4">
          <p class="pill border-white/30 bg-white/10 text-white">Welcome Back</p>
          <h2 class="text-3xl font-bold text-white">เข้าสู่ระบบเพื่อจัดการการเช่า</h2>
          <p class="text-slate-200">เข้าถึงแดชบอร์ด การแจ้งเตือน และดีลพิเศษสำหรับสมาชิกระดับพรีเมียม</p>
          <ul class="space-y-2 text-sm text-amber-100/90">
            <li class="flex items-center space-x-2"><span class="text-xl">•</span><span>สรุปสถานะเช่าแบบเรียลไทม์</span></li>
            <li class="flex items-center space-x-2"><span class="text-xl">•</span><span>การแจ้งเตือนการคืนและคูปอง</span></li>
            <li class="flex items-center space-x-2"><span class="text-xl">•</span><span>ความปลอดภัยระดับเอ็นเตอร์ไพรส์</span></li>
          </ul>
        </div>
      </div>
      <div class="p-8 md:p-10">
        <div class="mb-8 space-y-2">
          <p class="text-sm uppercase tracking-[0.25em] text-amber-200">Sign In</p>
          <h1 class="text-3xl font-bold text-white">เข้าสู่ระบบ</h1>
          <p class="text-slate-300">กรอกข้อมูลเพื่อเข้าใช้งานระบบเช่ายืม</p>
        </div>
        <form @submit.prevent="login" class="space-y-5">
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
            <label class="text-sm font-semibold text-slate-200">รหัสผ่าน</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-200/60 focus:outline-none"
            />
          </div>
          <div class="flex items-center justify-between text-sm text-slate-300">
            <label class="inline-flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-white/20 bg-transparent" />
              <span>จดจำฉัน</span>
            </label>
            <a href="#" class="text-amber-200">ลืมรหัสผ่าน?</a>
          </div>
          <button type="submit" class="primary-btn w-full justify-center">เข้าสู่ระบบ</button>
        </form>
        <p class="mt-6 text-center text-sm text-slate-300">
          ยังไม่มีบัญชี?
          <router-link to="/register" class="text-amber-200">สมัครสมาชิก</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = reactive({ email: '', password: '' })

const login = async () => {
  try {
    const response = await authAPI.login(form)
    const token = response.data?.accessToken
    if (token) {
      localStorage.setItem('token', token)
      await authStore.fetchProfile()
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>
