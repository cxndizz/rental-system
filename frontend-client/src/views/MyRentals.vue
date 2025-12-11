<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8">รายการเช่าของฉัน</h1>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="currentTab = tab.value"
            class="flex-1 px-6 py-4 font-semibold transition"
            :class="currentTab === tab.value ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Rentals List -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="filteredRentals.length" class="space-y-4">
        <div
          v-for="rental in filteredRentals"
          :key="rental.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold mb-1">{{ rental.orderNumber }}</h3>
                <p class="text-sm text-gray-600">{{ formatDate(rental.createdAt) }}</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-sm font-semibold"
                :class="getStatusClass(rental.status)"
              >
                {{ getStatusText(rental.status) }}
              </span>
            </div>

            <!-- Rental Items -->
            <div class="space-y-3 mb-4">
              <div
                v-for="item in rental.items"
                :key="item.id"
                class="flex gap-4 border-b pb-3 last:border-b-0"
              >
                <img
                  :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/100'"
                  :alt="item.item?.name"
                  class="w-20 h-20 object-cover rounded"
                />
                <div class="flex-1">
                  <h4 class="font-semibold">{{ item.item?.name }}</h4>
                  <p class="text-sm text-gray-600">จำนวน: {{ item.quantity }} | ราคา/วัน: {{ item.pricePerDay }} ฿</p>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
                    ({{ calculateDays(item.startDate, item.endDate) }} วัน)
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-blue-600">{{ item.subtotal }} ฿</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center border-t pt-4">
              <div>
                <p class="text-lg font-bold">ราคารวม: {{ rental.totalPrice }} ฿</p>
                <p class="text-sm text-gray-600">
                  วันที่คืน: {{ rental.returnDate ? formatDate(rental.returnDate) : 'ยังไม่คืน' }}
                </p>
              </div>
              <div class="flex gap-2">
                <router-link
                  :to="`/rentals/${rental.id}`"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  ดูรายละเอียด
                </router-link>
                <button
                  v-if="rental.status === 'ON_RENT'"
                  @click="initiateReturn(rental.id)"
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  คืนสินค้า
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600 text-lg">ไม่พบรายการเช่า</p>
        <router-link
          to="/items"
          class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          เรียกดูสินค้า
        </router-link>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-center mt-8 gap-2">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { rentalsAPI, returnsAPI } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const rentals = ref([]);
const loading = ref(false);
const currentTab = ref('ALL');
const pagination = ref({ total: 0, page: 1, limit: 10, totalPages: 1 });

const tabs = [
  { label: 'ทั้งหมด', value: 'ALL' },
  { label: 'รอการยืนยัน', value: 'PENDING' },
  { label: 'กำลังเช่า', value: 'ON_RENT' },
  { label: 'เสร็จสิ้น', value: 'COMPLETED' },
  { label: 'ยกเลิก', value: 'CANCELLED' },
];

const filteredRentals = computed(() => {
  if (currentTab.value === 'ALL') {
    return rentals.value;
  }
  return rentals.value.filter(r => r.status === currentTab.value);
});

onMounted(async () => {
  await loadRentals();
});

const loadRentals = async () => {
  loading.value = true;
  try {
    const response = await rentalsAPI.getUserRentals(user.id, {
      page: pagination.value.page,
      limit: pagination.value.limit,
    });
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

const initiateReturn = async (rentalId) => {
  if (confirm('คุณต้องการคืนสินค้าใช่หรือไม่?')) {
    try {
      await returnsAPI.create(rentalId);
      alert('สร้างคำขอคืนสินค้าเรียบร้อยแล้ว');
      await loadRentals();
    } catch (error) {
      console.error('Error creating return:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }
};
</script>
