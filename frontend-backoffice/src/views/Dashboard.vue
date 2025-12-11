<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-4xl font-bold mb-8">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-gray-600 text-sm font-semibold mb-2">ผู้ใช้ทั้งหมด</h3>
        <p class="text-3xl font-bold text-blue-600">{{ stats.totalUsers }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-gray-600 text-sm font-semibold mb-2">สินค้าทั้งหมด</h3>
        <p class="text-3xl font-bold text-green-600">{{ stats.totalItems }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-gray-600 text-sm font-semibold mb-2">การเช่าทั้งหมด</h3>
        <p class="text-3xl font-bold text-purple-600">{{ stats.totalRentals }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-gray-600 text-sm font-semibold mb-2">รายได้รวม</h3>
        <p class="text-3xl font-bold text-yellow-600">{{ formatCurrency(stats.totalRevenue) }}</p>
      </div>
    </div>

    <!-- Pending Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">การคืนรอตรวจสอบ</h2>
        <p class="text-4xl font-bold text-red-600">{{ stats.pendingReturns }}</p>
        <router-link to="/returns" class="text-blue-600 hover:underline mt-4 block">
          ดูรายละเอียด →
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">คำสั่งเช่าใหม่</h2>
        <p class="text-4xl font-bold text-green-600">{{ pendingRentals }}</p>
        <router-link to="/rentals?status=PENDING" class="text-blue-600 hover:underline mt-4 block">
          ดูรายละเอียด →
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
