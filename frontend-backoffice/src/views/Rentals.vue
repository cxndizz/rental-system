<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <h1 class="text-4xl font-bold mb-6">จัดการรายการเช่า</h1>

    <!-- Status Tabs -->
    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl mb-6 overflow-hidden">
      <div class="flex border-b">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentTab = tab.value; loadRentals()"
          class="flex-1 px-6 py-4 font-semibold transition"
          :class="currentTab === tab.value ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-gray-100'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Rentals Table -->
    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <p class="text-slate-300">กำลังโหลดข้อมูล...</p>
      </div>

      <table v-else-if="rentals.length" class="w-full">
        <thead class="bg-white/5 border-b border-white/10">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">เลขที่</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">ลูกค้า</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">วันที่เช่า</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">จำนวนเงิน</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-200 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="rental in rentals" :key="rental.id" class="hover:bg-white/5">
            <td class="px-6 py-4">{{ rental.orderNumber }}</td>
            <td class="px-6 py-4">{{ rental.user?.profile?.firstName }} {{ rental.user?.profile?.lastName }}</td>
            <td class="px-6 py-4">{{ formatDate(rental.createdAt) }}</td>
            <td class="px-6 py-4">{{ rental.totalPrice }} ฿</td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="getStatusClass(rental.status)"
              >
                {{ getStatusText(rental.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <router-link
                  :to="`/rentals/${rental.id}`"
                  class="text-amber-200 hover:text-white"
                  title="ดูรายละเอียด"
                >
                  👁️
                </router-link>
                <button
                  v-if="rental.status === 'PENDING'"
                  @click="updateStatus(rental.id, 'APPROVED')"
                  class="text-green-600 hover:text-green-800"
                  title="อนุมัติ"
                >
                  ✓
                </button>
                <button
                  v-if="rental.status === 'PENDING'"
                  @click="updateStatus(rental.id, 'CANCELLED')"
                  class="text-red-600 hover:text-red-800"
                  title="ยกเลิก"
                >
                  ✗
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12">
        <p class="text-slate-300">ไม่พบรายการเช่า</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6 gap-2">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="changePage(page)"
        class="px-4 py-2 rounded"
        :class="pagination.page === page ? 'bg-blue-600 text-white' : 'bg-white text-slate-200 hover:bg-gray-100'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { rentalsAPI } from '@/services/api';

const rentals = ref([]);
const loading = ref(false);
const currentTab = ref('ALL');
const pagination = ref({ total: 0, page: 1, limit: 20, totalPages: 1 });

const tabs = [
  { label: 'ทั้งหมด', value: 'ALL' },
  { label: 'รอการยืนยัน', value: 'PENDING' },
  { label: 'อนุมัติแล้ว', value: 'APPROVED' },
  { label: 'กำลังเช่า', value: 'ON_RENT' },
  { label: 'เสร็จสิ้น', value: 'COMPLETED' },
];

onMounted(async () => {
  await loadRentals();
});

const loadRentals = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
    };
    if (currentTab.value !== 'ALL') {
      params.status = currentTab.value;
    }
    const response = await rentalsAPI.getAll(params);
    rentals.value = response.data.rentals;
    pagination.value = response.data.pagination;
  } catch (error) {
    console.error('Error loading rentals:', error);
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  pagination.value.page = page;
  loadRentals();
};

const updateStatus = async (id, status) => {
  try {
    await rentalsAPI.updateStatus(id, { status });
    alert('อัพเดทสถานะเรียบร้อยแล้ว');
    loadRentals();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
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
  };
  return texts[status] || status;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
