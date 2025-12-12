<template>
  <div class="min-h-screen text-slate-100">
    <div class="flex items-center justify-between mb-10">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-amber-200/80">Real-time performance</p>
        <h1 class="text-4xl font-semibold">Dashboard</h1>
      </div>
      <div class="hidden md:flex items-center gap-3">
        <span class="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-200">Operational overview</span>
        <span class="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 text-slate-950 font-semibold shadow-lg shadow-rose-500/30">
          Updated live
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <p class="text-sm text-slate-300">ผู้ใช้ทั้งหมด</p>
        <p class="text-4xl font-bold text-amber-300 mt-3">{{ stats.totalUsers }}</p>
        <p class="text-xs text-slate-400 mt-1">Verified & active</p>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <p class="text-sm text-slate-300">สินค้าทั้งหมด</p>
        <p class="text-4xl font-bold text-emerald-300 mt-3">{{ stats.totalItems }}</p>
        <p class="text-xs text-slate-400 mt-1">Catalog health</p>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <p class="text-sm text-slate-300">การเช่าทั้งหมด</p>
        <p class="text-4xl font-bold text-fuchsia-300 mt-3">{{ stats.totalRentals }}</p>
        <p class="text-xs text-slate-400 mt-1">Orders lifecycle</p>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <p class="text-sm text-slate-300">รายได้รวม</p>
        <p class="text-4xl font-bold text-amber-200 mt-3">{{ formatCurrency(stats.totalRevenue) }}</p>
        <p class="text-xs text-slate-400 mt-1">Gross collections</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/70 border border-white/10 shadow-2xl p-6">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-amber-200/70">Quality gate</p>
            <h2 class="text-2xl font-semibold">การคืนรอตรวจสอบ</h2>
          </div>
          <span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-100 text-xs border border-amber-500/40">Attention</span>
        </div>
        <p class="text-5xl font-black text-amber-300 mt-6">{{ stats.pendingReturns }}</p>
        <router-link to="/returns" class="inline-flex items-center gap-2 mt-6 text-amber-200 hover:text-white transition">
          ดูรายละเอียด
          <span aria-hidden="true">→</span>
        </router-link>
      </div>

      <div class="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/70 border border-white/10 shadow-2xl p-6">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Pipeline</p>
            <h2 class="text-2xl font-semibold">คำสั่งเช่าใหม่</h2>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-xs border border-emerald-500/40">Fresh</span>
        </div>
        <p class="text-5xl font-black text-emerald-300 mt-6">{{ pendingRentals }}</p>
        <router-link
          to="/rentals?status=PENDING"
          class="inline-flex items-center gap-2 mt-6 text-emerald-200 hover:text-white transition"
        >
          ดูรายละเอียด
          <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { reportsAPI, rentalsAPI } from '@/services/api';

const stats = ref({
  totalUsers: 0,
  totalItems: 0,
  totalRentals: 0,
  totalRevenue: 0,
  pendingReturns: 0,
});

const pendingRentals = ref(0);

onMounted(async () => {
  try {
    const [dashboardRes, rentalsRes] = await Promise.all([
      reportsAPI.getDashboard(),
      rentalsAPI.getAll({ status: 'PENDING', limit: 1 }),
    ]);

    stats.value = dashboardRes.data;
    pendingRentals.value = rentalsRes.data.pagination.total;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(amount || 0);
};
</script>
