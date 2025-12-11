<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-4xl font-bold mb-6">บันทึกการใช้งานระบบ</h1>

    <div class="bg-white rounded-lg shadow-md mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="ค้นหา..."
          class="px-4 py-2 border rounded-lg"
          @input="searchLogs"
        />
        <select v-model="filters.action" class="px-4 py-2 border rounded-lg" @change="searchLogs">
          <option value="">ทุกการกระทำ</option>
          <option value="CREATE">สร้าง</option>
          <option value="UPDATE">แก้ไข</option>
          <option value="DELETE">ลบ</option>
          <option value="LOGIN">เข้าสู่ระบบ</option>
        </select>
        <button @click="resetFilters" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          รีเซ็ต
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <table v-else-if="logs.length" class="w-full">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">เวลา</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ผู้ใช้</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">การกระทำ</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">รายละเอียด</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">{{ formatDateTime(log.createdAt) }}</td>
            <td class="px-6 py-4">{{ log.user?.email || 'System' }}</td>
            <td class="px-6 py-4">
              <span :class="getActionClass(log.action)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ log.action }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">{{ log.details || '-' }}</td>
            <td class="px-6 py-4 text-sm">{{ log.ipAddress || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">ไม่พบบันทึก</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6 gap-2">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="changePage(page)"
        class="px-4 py-2 rounded"
        :class="pagination.page === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auditAPI } from '@/services/api';

const logs = ref([]);
const loading = ref(false);
const filters = ref({
  search: '',
  action: '',
  page: 1,
  limit: 50,
});
const pagination = ref({ total: 0, page: 1, limit: 50, totalPages: 1 });

onMounted(async () => {
  await loadLogs();
});

const loadLogs = async () => {
  loading.value = true;
  try {
    const response = await auditAPI.getLogs(filters.value);
    logs.value = response.data.logs || response.data;
    pagination.value = response.data.pagination || pagination.value;
  } catch (error) {
    console.error('Error loading audit logs:', error);
  } finally {
    loading.value = false;
  }
};

const searchLogs = () => {
  filters.value.page = 1;
  loadLogs();
};

const resetFilters = () => {
  filters.value = {
    search: '',
    action: '',
    page: 1,
    limit: 50,
  };
  loadLogs();
};

const changePage = (page) => {
  filters.value.page = page;
  loadLogs();
};

const getActionClass = (action) => {
  const classes = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    LOGIN: 'bg-purple-100 text-purple-800',
  };
  return classes[action] || 'bg-gray-100 text-gray-800';
};

const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('th-TH');
};
</script>
