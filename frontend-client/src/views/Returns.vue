<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8">การคืนสินค้า</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="returns.length" class="space-y-4">
        <div
          v-for="returnItem in returns"
          :key="returnItem.id"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold mb-1">เลขที่คืน: {{ returnItem.returnNumber }}</h3>
              <p class="text-sm text-gray-600">
                เลขที่เช่า: {{ returnItem.rentalOrder?.orderNumber }}
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-semibold"
              :class="getStatusClass(returnItem.status)"
            >
              {{ getStatusText(returnItem.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-600">วันที่สร้างคำขอ</p>
              <p class="font-semibold">{{ formatDate(returnItem.createdAt) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">วันที่คืนจริง</p>
              <p class="font-semibold">
                {{ returnItem.returnedAt ? formatDate(returnItem.returnedAt) : 'ยังไม่ได้คืน' }}
              </p>
            </div>
          </div>

          <!-- Return Items -->
          <div class="border-t pt-4">
            <h4 class="font-semibold mb-2">รายการสินค้าที่คืน:</h4>
            <div class="space-y-2">
              <div
                v-for="item in returnItem.items"
                :key="item.id"
                class="flex justify-between items-center text-sm"
              >
                <span>{{ item.rentalItem?.item?.name }}</span>
                <span class="text-gray-600">จำนวน: {{ item.quantity }}</span>
              </div>
            </div>
          </div>

          <!-- Inspection Notes -->
          <div v-if="returnItem.inspectionNotes" class="border-t mt-4 pt-4">
            <p class="text-sm text-gray-600">หมายเหตุการตรวจสอบ:</p>
            <p class="text-gray-800">{{ returnItem.inspectionNotes }}</p>
          </div>

          <!-- Refund Amount -->
          <div class="border-t mt-4 pt-4">
            <div class="flex justify-between items-center">
              <span class="font-semibold">จำนวนเงินที่คืน:</span>
              <span class="text-xl font-bold text-green-600">
                {{ returnItem.refundAmount || 0 }} ฿
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600 text-lg">ไม่มีรายการคืนสินค้า</p>
        <router-link
          to="/rentals"
          class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ดูรายการเช่า
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { returnsAPI } from '@/services/api';

const authStore = useAuthStore();
const user = authStore.user;

const returns = ref([]);
const loading = ref(false);

onMounted(async () => {
  await loadReturns();
});

const loadReturns = async () => {
  loading.value = true;
  try {
    const response = await returnsAPI.getPending();
    returns.value = response.data;
  } catch (error) {
    console.error('Error loading returns:', error);
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    INSPECTING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status) => {
  const texts = {
    PENDING: 'รอตรวจสอบ',
    INSPECTING: 'กำลังตรวจสอบ',
    COMPLETED: 'เสร็จสิ้น',
    REJECTED: 'ปฏิเสธ',
  };
  return texts[status] || status;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
