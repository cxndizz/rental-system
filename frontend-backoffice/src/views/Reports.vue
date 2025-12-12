<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <h1 class="text-4xl font-bold mb-6">รายงาน</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h3 class="text-slate-300 text-sm font-semibold mb-2">รายได้รวม</h3>
        <p class="text-3xl font-bold text-green-600">0 ฿</p>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h3 class="text-slate-300 text-sm font-semibold mb-2">การเช่าทั้งหมด</h3>
        <p class="text-3xl font-bold text-blue-600">0</p>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h3 class="text-slate-300 text-sm font-semibold mb-2">ลูกค้าทั้งหมด</h3>
        <p class="text-3xl font-bold text-purple-600">0</p>
      </div>
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h3 class="text-slate-300 text-sm font-semibold mb-2">สินค้าทั้งหมด</h3>
        <p class="text-3xl font-bold text-orange-600">0</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h2 class="text-2xl font-bold mb-4">รายงานรายได้</h2>
        <div class="space-y-2">
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-left">
            รายงานรายได้รายวัน
          </button>
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-left">
            รายงานรายได้รายเดือน
          </button>
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-left">
            รายงานรายได้รายปี
          </button>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h2 class="text-2xl font-bold mb-4">รายงานการเช่า</h2>
        <div class="space-y-2">
          <button class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-left">
            สถิติการเช่า
          </button>
          <button class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-left">
            รายงานสินค้ายอดนิยม
          </button>
          <button class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-left">
            รายงานอัตราการใช้งาน
          </button>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h2 class="text-2xl font-bold mb-4">รายงานลูกค้า</h2>
        <div class="space-y-2">
          <button class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-left">
            ข้อมูลลูกค้า
          </button>
          <button class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-left">
            พฤติกรรมการเช่า
          </button>
          <button class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-left">
            การยืนยันตัวตน (KYC)
          </button>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <h2 class="text-2xl font-bold mb-4">รายงานสินค้า</h2>
        <div class="space-y-2">
          <button class="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-left">
            คลังสินค้า
          </button>
          <button class="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-left">
            สินค้าที่ต้องซ่อมบำรุง
          </button>
          <button class="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-left">
            อัตราการหมุนเวียน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { reportsAPI } from '@/services/api';

// Reports component
onMounted(async () => {
  // Load dashboard data
  try {
    const response = await reportsAPI.getDashboard();
    console.log('Dashboard data:', response.data);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
});
</script>
