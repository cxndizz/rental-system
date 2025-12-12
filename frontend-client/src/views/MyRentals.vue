<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <div class="flex flex-col gap-2">
        <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Rental Portfolio</p>
        <h1 class="text-4xl font-bold leading-tight">รายการเช่าของฉัน</h1>
        <p class="text-slate-300">ติดตามสถานะคำสั่งเช่าแบบเรียลไทม์ พร้อมสรุปค่าใช้จ่ายอย่างโปร่งใส</p>
      </div>

      <div class="glass-card overflow-hidden rounded-2xl border-white/10">
        <div class="flex flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="currentTab = tab.value"
            class="flex-1 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition"
            :class="currentTab === tab.value ? 'bg-amber-300 text-slate-900' : 'text-slate-200 hover:bg-white/5'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">กำลังโหลดข้อมูล...</div>

      <div v-else-if="filteredRentals.length" class="space-y-4">
        <div
          v-for="rental in filteredRentals"
          :key="rental.id"
          class="glass-card overflow-hidden rounded-3xl border-white/10 p-6 shadow-xl"
        >
          <div class="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-300">เลขที่คำสั่ง</p>
              <h3 class="text-xl font-semibold text-white">{{ rental.orderNumber }}</h3>
              <p class="text-sm text-slate-300">{{ formatDate(rental.createdAt) }}</p>
            </div>
            <span class="pill self-start text-xs" :class="getStatusClass(rental.status)">{{ getStatusText(rental.status) }}</span>
          </div>

          <div class="space-y-3 py-4">
            <div
              v-for="item in rental.items"
              :key="item.id"
              class="glass-card flex gap-4 rounded-2xl border-white/5 p-4"
            >
              <img
                :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/100'"
                :alt="item.item?.name"
                class="h-20 w-20 rounded-xl object-cover"
              />
              <div class="flex-1 space-y-1">
                <h4 class="text-lg font-semibold text-white">{{ item.item?.name }}</h4>
                <p class="text-sm text-slate-300">จำนวน: {{ item.quantity }} | ราคา/วัน: {{ item.pricePerDay }} ฿</p>
                <p class="text-sm text-slate-400">
                  {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }} ({{ calculateDays(item.startDate, item.endDate) }} วัน)
                </p>
              </div>
              <div class="text-right text-amber-200 font-bold">{{ item.subtotal }} ฿</div>
            </div>
          </div>

          <div class="flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-lg font-bold text-white">ราคารวม: {{ rental.totalPrice }} ฿</p>
              <p class="text-sm text-slate-300">วันที่คืน: {{ rental.returnDate ? formatDate(rental.returnDate) : 'ยังไม่คืน' }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <router-link :to="`/rentals/${rental.id}`" class="ghost-btn px-4 py-2 text-sm">ดูรายละเอียด</router-link>
              <button
                v-if="rental.status === 'ON_RENT'"
                @click="initiateReturn(rental.id)"
                class="primary-btn px-4 py-2 text-sm"
              >
                คืนสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="glass-card rounded-3xl border-white/10 p-12 text-center text-slate-300">
        <p class="text-lg">ไม่พบรายการเช่า</p>
        <router-link to="/items" class="primary-btn mt-4 inline-flex px-6 py-2">เรียกดูสินค้า</router-link>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2">
        <button
          v-for="page in pagination.totalPages"
          :key="page"
          @click="changePage(page)"
          class="rounded-xl px-4 py-2 text-sm font-semibold"
          :class="pagination.page === page ? 'bg-amber-300 text-slate-900' : 'glass-card border-white/10 text-white'"
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
    PENDING: 'border-amber-300/50 bg-amber-300/10 text-amber-100',
    APPROVED: 'border-sky-300/50 bg-sky-300/10 text-sky-100',
    ON_RENT: 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100',
    RETURNED: 'border-purple-300/50 bg-purple-300/10 text-purple-100',
    COMPLETED: 'border-white/20 bg-white/5 text-slate-200',
    CANCELLED: 'border-red-400/60 bg-red-400/10 text-red-100',
    OVERDUE: 'border-amber-400/60 bg-amber-400/10 text-amber-100',
  };
  return classes[status] || 'border-white/10 bg-white/5 text-slate-200';
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
