<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="rental" class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-600 text-white p-6">
          <h1 class="text-3xl font-bold mb-2">รายละเอียดการเช่า</h1>
          <p class="text-blue-100">เลขที่: {{ rental.orderNumber }}</p>
        </div>

        <!-- Status and Info -->
        <div class="p-6 border-b">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span
                class="px-4 py-2 rounded-full text-sm font-semibold inline-block"
                :class="getStatusClass(rental.status)"
              >
                {{ getStatusText(rental.status) }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">วันที่สร้าง</p>
              <p class="font-semibold">{{ formatDate(rental.createdAt) }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p class="text-sm text-gray-600">วันที่เริ่มเช่า</p>
              <p class="font-semibold">{{ formatDate(rental.startDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">วันที่สิ้นสุด</p>
              <p class="font-semibold">{{ formatDate(rental.endDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">วันที่คืน</p>
              <p class="font-semibold">{{ rental.returnDate ? formatDate(rental.returnDate) : 'ยังไม่คืน' }}</p>
            </div>
          </div>
        </div>

        <!-- Rental Items -->
        <div class="p-6 border-b">
          <h2 class="text-2xl font-bold mb-4">รายการสินค้า</h2>
          <div class="space-y-4">
            <div
              v-for="item in rental.items"
              :key="item.id"
              class="flex gap-4 border-b pb-4 last:border-b-0"
            >
              <img
                :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/150'"
                :alt="item.item?.name"
                class="w-24 h-24 object-cover rounded"
              />
              <div class="flex-1">
                <h3 class="font-bold text-lg">{{ item.item?.name }}</h3>
                <p class="text-gray-600 text-sm mb-2">{{ item.item?.description }}</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-600">จำนวน:</span>
                    <span class="font-semibold ml-1">{{ item.quantity }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">ราคา/วัน:</span>
                    <span class="font-semibold ml-1">{{ item.pricePerDay }} ฿</span>
                  </div>
                  <div>
                    <span class="text-gray-600">จำนวนวัน:</span>
                    <span class="font-semibold ml-1">{{ calculateDays(item.startDate, item.endDate) }} วัน</span>
                  </div>
                  <div>
                    <span class="text-gray-600">รวม:</span>
                    <span class="font-semibold ml-1 text-blue-600">{{ item.subtotal }} ฿</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="p-6 border-b">
          <h2 class="text-2xl font-bold mb-4">ข้อมูลการชำระเงิน</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">ราคาเช่า</span>
              <span class="font-semibold">{{ rental.totalPrice }} ฿</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">ค่ามัดจำ</span>
              <span class="font-semibold">{{ rental.depositAmount || 0 }} ฿</span>
            </div>
            <div class="flex justify-between border-t pt-2">
              <span class="text-lg font-bold">รวมทั้งหมด</span>
              <span class="text-lg font-bold text-blue-600">
                {{ (rental.totalPrice || 0) + (rental.depositAmount || 0) }} ฿
              </span>
            </div>
          </div>

          <div v-if="rental.invoice" class="mt-4 p-4 bg-gray-50 rounded">
            <p class="text-sm text-gray-600">เลขที่ใบแจ้งหนี้: {{ rental.invoice.invoiceNumber }}</p>
            <p class="text-sm text-gray-600">สถานะ: {{ rental.invoice.status }}</p>
          </div>
        </div>

        <!-- Delivery Address -->
        <div v-if="rental.deliveryAddress" class="p-6 border-b">
          <h2 class="text-2xl font-bold mb-4">ที่อยู่จัดส่ง</h2>
          <p class="text-gray-700">{{ rental.deliveryAddress }}</p>
        </div>

        <!-- Actions -->
        <div class="p-6 flex gap-4">
          <router-link
            to="/rentals"
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            กลับ
          </router-link>
          <button
            v-if="rental.status === 'ON_RENT'"
            @click="initiateReturn"
            class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            คืนสินค้า
          </button>
          <button
            v-if="rental.status === 'COMPLETED' && !rental.hasReview"
            @click="router.push(`/reviews/create?rentalId=${rental.id}`)"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            เขียนรีวิว
          </button>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600">ไม่พบข้อมูลการเช่า</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { rentalsAPI, returnsAPI } from '@/services/api';

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

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ON_RENT: 'bg-green-100 text-green-800',
    RETURNED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    OVERDUE: 'bg-red-200 text-red-900',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status) => {
  const texts = {
    PENDING: 'รอการยืนยัน',
    APPROVED: 'อนุมัติแล้ว',
    ON_RENT: 'กำลังเช่า',
    RETURNED: 'คืนแล้ว',
    COMPLETED: 'เสร็จสิ้น',
    CANCELLED: 'ยกเลิก',
    OVERDUE: 'เกินกำหนด',
  };
  return texts[status] || status;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};

const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return diff;
};

const initiateReturn = async () => {
  if (confirm('คุณต้องการคืนสินค้าใช่หรือไม่?')) {
    try {
      await returnsAPI.create(rental.value.id);
      alert('สร้างคำขอคืนสินค้าเรียบร้อยแล้ว');
      await loadRental();
    } catch (error) {
      console.error('Error creating return:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }
};
</script>
