<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <div class="max-w-6xl mx-auto">
      <div v-if="loading" class="text-center py-12">
        <p class="text-slate-300">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="rental">
        <h1 class="text-4xl font-bold mb-8">รายละเอียดการเช่า #{{ rental.orderNumber }}</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Customer Info -->
          <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
            <h2 class="text-xl font-bold mb-4">ข้อมูลลูกค้า</h2>
            <div class="space-y-2">
              <p><span class="font-semibold">ชื่อ:</span> {{ rental.user?.profile?.firstName }} {{ rental.user?.profile?.lastName }}</p>
              <p><span class="font-semibold">อีเมล:</span> {{ rental.user?.email }}</p>
              <p><span class="font-semibold">โทรศัพท์:</span> {{ rental.user?.profile?.phoneNumber }}</p>
            </div>
          </div>

          <!-- Rental Info -->
          <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
            <h2 class="text-xl font-bold mb-4">ข้อมูลการเช่า</h2>
            <div class="space-y-2">
              <p><span class="font-semibold">สถานะ:</span>
                <span :class="getStatusClass(rental.status)" class="ml-2 px-2 py-1 rounded text-xs">
                  {{ getStatusText(rental.status) }}
                </span>
              </p>
              <p><span class="font-semibold">วันที่สร้าง:</span> {{ formatDate(rental.createdAt) }}</p>
              <p><span class="font-semibold">วันเริ่มเช่า:</span> {{ formatDate(rental.startDate) }}</p>
              <p><span class="font-semibold">วันสิ้นสุด:</span> {{ formatDate(rental.endDate) }}</p>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
            <h2 class="text-xl font-bold mb-4">ข้อมูลการชำระเงิน</h2>
            <div class="space-y-2">
              <p><span class="font-semibold">ราคารวม:</span> {{ rental.totalPrice }} ฿</p>
              <p><span class="font-semibold">มัดจำ:</span> {{ rental.depositAmount || 0 }} ฿</p>
              <p><span class="font-semibold">รวมทั้งหมด:</span> {{ (rental.totalPrice || 0) + (rental.depositAmount || 0) }} ฿</p>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6 mt-6">
          <h2 class="text-2xl font-bold mb-4">รายการสินค้า</h2>
          <table class="w-full">
            <thead class="bg-white/5 border-b border-white/10">
              <tr>
                <th class="px-4 py-2 text-left">สินค้า</th>
                <th class="px-4 py-2 text-left">จำนวน</th>
                <th class="px-4 py-2 text-left">ราคา/วัน</th>
                <th class="px-4 py-2 text-left">จำนวนวัน</th>
                <th class="px-4 py-2 text-left">รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in rental.items" :key="item.id" class="border-b">
                <td class="px-4 py-2">{{ item.item?.name }}</td>
                <td class="px-4 py-2">{{ item.quantity }}</td>
                <td class="px-4 py-2">{{ item.pricePerDay }} ฿</td>
                <td class="px-4 py-2">{{ calculateDays(item.startDate, item.endDate) }}</td>
                <td class="px-4 py-2">{{ item.subtotal }} ฿</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6 mt-6">
          <h2 class="text-2xl font-bold mb-4">การจัดการ</h2>
          <div class="flex gap-4">
            <button
              v-if="rental.status === 'PENDING'"
              @click="updateStatus('APPROVED')"
              class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              อนุมัติ
            </button>
            <button
              v-if="rental.status === 'PENDING'"
              @click="updateStatus('CANCELLED')"
              class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ยกเลิก
            </button>
            <button
              v-if="rental.status === 'APPROVED'"
              @click="updateStatus('ON_RENT')"
              class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              เริ่มเช่า
            </button>
            <router-link
              to="/rentals"
              class="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              กลับ
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { rentalsAPI } from '@/services/api';

const route = useRoute();
const router = useRouter();
const rental = ref(null);
const loading = ref(false);

onMounted(async () => {
  await loadRental();
});

const loadRental = async () => {
  loading.value = true;
  try {
    const response = await rentalsAPI.getById(route.params.id);
    rental.value = response.data;
  } catch (error) {
    console.error('Error loading rental:', error);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (status) => {
  try {
    await rentalsAPI.updateStatus(route.params.id, { status });
    alert('อัพเดทสถานะเรียบร้อยแล้ว');
    await loadRental();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('เกิดข้อผิดพลาด');
  }
};

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ON_RENT: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status) => {
  const texts = {
    PENDING: 'รอการยืนยัน',
    APPROVED: 'อนุมัติแล้ว',
    ON_RENT: 'กำลังเช่า',
    COMPLETED: 'เสร็จสิ้น',
    CANCELLED: 'ยกเลิก',
  };
  return texts[status] || status;
};

const formatDate = (date) => new Date(date).toLocaleDateString('th-TH');
const calculateDays = (start, end) => Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
</script>
