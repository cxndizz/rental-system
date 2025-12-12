<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <header class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Personal Control Center</p>
          <h1 class="text-4xl font-bold leading-tight">แดชบอร์ดของฉัน</h1>
          <p class="text-slate-300">ยินดีต้อนรับ {{ user?.profile?.firstName || 'ผู้ใช้' }} กลับสู่ประสบการณ์เช่าระดับเอ็นเตอร์ไพรส์</p>
        </div>
        <div class="glass-card flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg">
          <span class="pill border-emerald-300/60 bg-emerald-300/10 text-emerald-100">บัญชี Premium</span>
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-amber-300/70 to-emerald-300/60" />
        </div>
      </header>

      <section class="lux-grid grid-cols-1 md:grid-cols-4">
        <div class="glass-card space-y-2 rounded-2xl border-white/10 p-5 shadow-xl">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">การเช่าทั้งหมด</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-extrabold text-white">{{ stats.totalRentals }}</p>
            <span class="pill border-white/10 bg-white/5 text-xs text-slate-200">ทั้งหมด</span>
          </div>
          <p class="text-xs text-slate-400">รวมทุกสถานะคำสั่งเช่า</p>
        </div>
        <div class="glass-card space-y-2 rounded-2xl border-white/10 p-5 shadow-xl">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">กำลังเช่า</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-extrabold text-emerald-200">{{ stats.activeRentals }}</p>
            <span class="pill border-emerald-300/50 bg-emerald-300/10 text-emerald-100">Live</span>
          </div>
          <p class="text-xs text-slate-400">คำสั่งเช่าที่กำลังดำเนินการ</p>
        </div>
        <div class="glass-card space-y-2 rounded-2xl border-white/10 p-5 shadow-xl">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">เกินกำหนด</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-extrabold text-amber-200">{{ stats.overdueRentals }}</p>
            <span class="pill border-amber-300/50 bg-amber-300/10 text-amber-100">Alert</span>
          </div>
          <p class="text-xs text-slate-400">ติดตามคืนสินค้าอย่างใกล้ชิด</p>
        </div>
        <div class="glass-card space-y-2 rounded-2xl border-white/10 p-5 shadow-xl">
          <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Wishlist</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-extrabold text-sky-200">{{ stats.wishlistItems }}</p>
            <span class="pill border-sky-300/50 bg-sky-300/10 text-sky-100">Collection</span>
          </div>
          <p class="text-xs text-slate-400">ไอเท็มที่คุณหมายตา</p>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <router-link to="/items" class="glass-card group rounded-2xl border-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-amber-200/50">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-amber-200">Browse</p>
              <h3 class="text-xl font-semibold text-white">เรียกดูสินค้า</h3>
            </div>
            <span class="pill border-white/10 bg-white/5 text-slate-200">คอลเลคชันใหม่</span>
          </div>
          <p class="mt-3 text-sm text-slate-300">ค้นหาไอเท็มพรีเมียมที่ตรงกับสไตล์และกำหนดเวลาของคุณ</p>
        </router-link>
        <router-link to="/rentals" class="glass-card group rounded-2xl border-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-amber-200/50">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-emerald-200">Monitor</p>
              <h3 class="text-xl font-semibold text-white">รายการเช่าของฉัน</h3>
            </div>
            <span class="pill border-emerald-300/50 bg-emerald-300/10 text-emerald-100">ติดตาม</span>
          </div>
          <p class="mt-3 text-sm text-slate-300">ดูสถานะ เช็คกำหนดคืน และจัดการเอกสารสำคัญได้ในที่เดียว</p>
        </router-link>
        <router-link to="/wishlist" class="glass-card group rounded-2xl border-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:border-amber-200/50">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-sky-200">Curate</p>
              <h3 class="text-xl font-semibold text-white">Wishlist</h3>
            </div>
            <span class="pill border-sky-300/50 bg-sky-300/10 text-sky-100">บันทึก</span>
          </div>
          <p class="mt-3 text-sm text-slate-300">เก็บรวบรวมไอเท็มโปรดและรับการแจ้งเตือนเมื่อมีดีลใหม่</p>
        </router-link>
      </section>

      <section class="glass-card rounded-3xl border-white/10 p-6 shadow-2xl">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-amber-200">Timeline</p>
            <h2 class="text-2xl font-bold text-white">รายการเช่าล่าสุด</h2>
          </div>
          <router-link to="/rentals" class="ghost-btn px-4 py-2 text-sm">ดูทั้งหมด</router-link>
        </div>

        <div v-if="recentRentals.length" class="mt-5 space-y-4">
          <div v-for="rental in recentRentals" :key="rental.id" class="glass-card flex items-center justify-between gap-4 rounded-2xl border-white/10 p-4">
            <div class="space-y-1">
              <p class="text-sm uppercase tracking-[0.15em] text-slate-300">{{ rental.orderNumber }}</p>
              <p class="text-lg font-semibold text-white">{{ formatDate(rental.createdAt) }}</p>
              <p class="text-sm text-slate-300">ราคารวม {{ rental.totalPrice }} ฿</p>
            </div>
            <span class="pill border-white/10 bg-white/5 text-xs" :class="{
              'border-amber-300/50 bg-amber-300/10 text-amber-100': rental.status === 'PENDING',
              'border-emerald-300/50 bg-emerald-300/10 text-emerald-100': rental.status === 'ON_RENT',
              'border-sky-300/50 bg-sky-300/10 text-sky-100': rental.status === 'COMPLETED',
            }">
              {{ rental.status }}
            </span>
          </div>
        </div>
        <p v-else class="py-8 text-center text-slate-300">ไม่มีรายการเช่า</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { rentalsAPI } from '@/services/api';

const authStore = useAuthStore();
const user = authStore.user;

const stats = ref({
  totalRentals: 0,
  activeRentals: 0,
  overdueRentals: 0,
  wishlistItems: 0,
});

const recentRentals = ref([]);

onMounted(async () => {
  if (user) {
    await loadRentals();
  }
});

const loadRentals = async () => {
  try {
    const response = await rentalsAPI.getUserRentals(user.id, { limit: 5 });
    recentRentals.value = response.data.rentals;
    stats.value.totalRentals = response.data.pagination.total;
    stats.value.activeRentals = recentRentals.value.filter((r) => r.status === 'ON_RENT').length;
    stats.value.overdueRentals = recentRentals.value.filter((r) => r.status === 'OVERDUE').length;
  } catch (error) {
    console.error('Error loading rentals:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
