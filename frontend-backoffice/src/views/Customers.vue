<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-4xl font-bold mb-6">จัดการลูกค้า</h1>

    <div class="bg-white rounded-lg shadow-md mb-6 p-4">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาลูกค้า..."
        class="w-full px-4 py-2 border rounded-lg"
        @input="searchCustomers"
      />
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <table v-else-if="customers.length" class="w-full">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ชื่อ-นามสกุล</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">อีเมล</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">โทรศัพท์</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">KYC</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">{{ customer.profile?.firstName }} {{ customer.profile?.lastName }}</td>
            <td class="px-6 py-4">{{ customer.email }}</td>
            <td class="px-6 py-4">{{ customer.profile?.phoneNumber }}</td>
            <td class="px-6 py-4">
              <span :class="getKYCClass(customer.kyc?.status)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ getKYCText(customer.kyc?.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <router-link
                :to="`/customers/${customer.id}`"
                class="text-blue-600 hover:text-blue-800"
              >
                ดูรายละเอียด
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">ไม่พบข้อมูลลูกค้า</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usersAPI } from '@/services/api';

const customers = ref([]);
const loading = ref(false);
const search = ref('');

onMounted(async () => {
  await loadCustomers();
});

const loadCustomers = async () => {
  loading.value = true;
  try {
    const response = await usersAPI.getAll({ search: search.value });
    customers.value = response.data.users || response.data;
  } catch (error) {
    console.error('Error loading customers:', error);
  } finally {
    loading.value = false;
  }
};

const searchCustomers = () => {
  loadCustomers();
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
</script>
