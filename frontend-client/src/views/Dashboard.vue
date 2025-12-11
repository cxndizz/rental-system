<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-4xl font-bold">แดชบอร์ดของฉัน</h1>
        <p class="text-gray-600 mt-2">ยินดีต้อนรับ, {{ user?.profile?.firstName || 'ผู้ใช้' }}!</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-gray-600 text-sm font-semibold mb-2">การเช่าทั้งหมด</h3>
          <p class="text-3xl font-bold text-blue-600">{{ stats.totalRentals }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-gray-600 text-sm font-semibold mb-2">กำลังเช่า</h3>
          <p class="text-3xl font-bold text-green-600">{{ stats.activeRentals }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-gray-600 text-sm font-semibold mb-2">เกินกำหนด</h3>
          <p class="text-3xl font-bold text-red-600">{{ stats.overdueRentals }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-gray-600 text-sm font-semibold mb-2">Wishlist</h3>
          <p class="text-3xl font-bold text-purple-600">{{ stats.wishlistItems }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link
          to="/items"
          class="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition text-center"
        >
          <p class="text-lg font-semibold">เรียกดูสินค้า</p>
        </router-link>
        <router-link
          to="/rentals"
          class="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition text-center"
        >
          <p class="text-lg font-semibold">รายการเช่าของฉัน</p>
        </router-link>
        <router-link
          to="/wishlist"
          class="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition text-center"
        >
          <p class="text-lg font-semibold">Wishlist</p>
        </router-link>
      </div>

      <!-- Recent Rentals -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">รายการเช่าล่าสุด</h2>
        <div v-if="recentRentals.length" class="space-y-4">
          <div
            v-for="rental in recentRentals"
            :key="rental.id"
            class="border-b pb-4 last:border-b-0 flex justify-between items-center"
          >
            <div>
              <p class="font-semibold">{{ rental.orderNumber }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(rental.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-blue-600">{{ rental.totalPrice }} ฿</p>
              <span
                class="text-xs px-2 py-1 rounded"
                :class="{
                  'bg-yellow-100 text-yellow-800': rental.status === 'PENDING',
                  'bg-green-100 text-green-800': rental.status === 'ON_RENT',
                  'bg-blue-100 text-blue-800': rental.status === 'COMPLETED',
                }"
              >
                {{ rental.status }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-4">ไม่มีรายการเช่า</p>
      </div>
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
