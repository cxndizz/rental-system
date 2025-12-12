<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <h1 class="text-4xl font-bold mb-6">จัดการลูกค้า</h1>

    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl mb-6 p-4">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหาลูกค้า..."
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"
        @input="searchCustomers"
      />
    </div>

    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <p class="text-slate-300">กำลังโหลดข้อมูล...</p>
      </div>

      <table v-else-if="customers.length" class="w-full">
        <thead class="bg-white/5 border-b border-white/10">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">ชื่อ-นามสกุล</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">อีเมล</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">โทรศัพท์</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">KYC</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="customer in customers" :key="customer.id" class="hover:bg-white/5">
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
                class="text-amber-200 hover:text-white"
              >
                ดูรายละเอียด
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12">
        <p class="text-slate-300">ไม่พบข้อมูลลูกค้า</p>
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
  PENDING: 'bg-amber-500/15 text-amber-100 border border-amber-400/40 px-3 py-1 rounded-full',
  APPROVED: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/40 px-3 py-1 rounded-full',
  REJECTED: 'bg-rose-500/15 text-rose-100 border border-rose-400/40 px-3 py-1 rounded-full',
}[status] || 'bg-slate-500/15 text-slate-200 border border-slate-400/40 px-3 py-1 rounded-full');

const getKYCText = (status) => ({
  PENDING: 'รอตรวจสอบ',
  APPROVED: 'ผ่าน',
  REJECTED: 'ไม่ผ่าน',
}[status] || 'ไม่มี');
</script>
