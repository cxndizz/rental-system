<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">รายละเอียดลูกค้า</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="customer" class="space-y-6">
        <!-- Profile Info -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">ข้อมูลส่วนตัว</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">ชื่อ-นามสกุล</p>
              <p class="font-semibold">{{ customer.profile?.firstName }} {{ customer.profile?.lastName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">อีเมล</p>
              <p class="font-semibold">{{ customer.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">โทรศัพท์</p>
              <p class="font-semibold">{{ customer.profile?.phoneNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">วันที่สมัคร</p>
              <p class="font-semibold">{{ formatDate(customer.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- KYC Info -->
        <div v-if="customer.kyc" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">ข้อมูล KYC</h2>
          <div class="mb-4">
            <span :class="getKYCClass(customer.kyc.status)" class="px-3 py-1 rounded text-sm font-semibold">
              {{ getKYCText(customer.kyc.status) }}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">ประเภทบัตร</p>
              <p class="font-semibold">{{ customer.kyc.idCardType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">เลขที่บัตร</p>
              <p class="font-semibold">{{ customer.kyc.idCardNumber }}</p>
            </div>
          </div>

          <div v-if="customer.kyc.status === 'PENDING'" class="mt-4 flex gap-4">
            <button
              @click="verifyKYC('APPROVED')"
              class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              อนุมัติ
            </button>
            <button
              @click="verifyKYC('REJECTED')"
              class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ปฏิเสธ
            </button>
          </div>
        </div>

        <!-- Rental History -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">ประวัติการเช่า</h2>
          <p class="text-gray-600">จำนวนครั้งที่เช่า: {{ customer.rentalCount || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usersAPI } from '@/services/api';

const route = useRoute();
const customer = ref(null);
const loading = ref(false);

onMounted(async () => {
  await loadCustomer();
});

const loadCustomer = async () => {
  loading.value = true;
  try {
    const response = await usersAPI.getProfile(route.params.id);
    customer.value = response.data;
  } catch (error) {
    console.error('Error loading customer:', error);
  } finally {
    loading.value = false;
  }
};

const verifyKYC = async (status) => {
  try {
    await usersAPI.verifyKYC(route.params.id, { status });
    alert('บันทึกเรียบร้อยแล้ว');
    await loadCustomer();
  } catch (error) {
    console.error('Error verifying KYC:', error);
    alert('เกิดข้อผิดพลาด');
  }
};

const getKYCClass = (status) => ({
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}[status] || 'bg-gray-100 text-gray-800');

const getKYCText = (status) => ({
  PENDING: 'รอตรวจสอบ',
  APPROVED: 'ผ่าน',
  REJECTED: 'ไม่ผ่าน',
}[status] || 'ไม่มี');

const formatDate = (date) => new Date(date).toLocaleDateString('th-TH');
</script>
