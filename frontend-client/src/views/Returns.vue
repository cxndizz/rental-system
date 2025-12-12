<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div class="flex flex-col gap-2">
        <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Return Center</p>
        <h1 class="text-4xl font-bold leading-tight">การคืนสินค้า</h1>
        <p class="text-slate-300">ติดตามคำขอคืนสินค้าและสถานะการตรวจสอบอย่างโปร่งใส</p>
      </div>

      <div v-if="loading" class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">กำลังโหลดข้อมูล...</div>

      <div v-else-if="returns.length" class="space-y-4">
        <div
          v-for="returnItem in returns"
          :key="returnItem.id"
          class="glass-card rounded-3xl border-white/10 p-6 shadow-xl"
        >
          <div class="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-300">เลขที่คืน</p>
              <h3 class="text-xl font-semibold text-white">{{ returnItem.returnNumber }}</h3>
              <p class="text-sm text-slate-300">เลขที่เช่า: {{ returnItem.rentalOrder?.orderNumber }}</p>
            </div>
            <span class="pill text-xs" :class="getStatusClass(returnItem.status)">{{ getStatusText(returnItem.status) }}</span>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 py-4">
            <div>
              <p class="text-sm text-slate-300">วันที่สร้างคำขอ</p>
              <p class="text-lg font-semibold text-white">{{ formatDate(returnItem.createdAt) }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-300">วันที่คืนจริง</p>
              <p class="text-lg font-semibold text-white">{{ returnItem.returnedAt ? formatDate(returnItem.returnedAt) : 'ยังไม่ได้คืน' }}</p>
            </div>
          </div>

          <div class="border-t border-white/10 pt-4">
            <h4 class="font-semibold text-white">รายการสินค้าที่คืน</h4>
            <div class="mt-2 space-y-2 text-sm text-slate-300">
              <div
                v-for="item in returnItem.items"
                :key="item.id"
                class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <span>{{ item.rentalItem?.item?.name }}</span>
                <span class="text-slate-200">จำนวน: {{ item.quantity }}</span>
              </div>
            </div>
          </div>

          <div v-if="returnItem.inspectionNotes" class="border-t border-white/10 pt-4 text-sm text-slate-200">
            <p class="text-slate-300">หมายเหตุการตรวจสอบ:</p>
            <p>{{ returnItem.inspectionNotes }}</p>
          </div>

          <div class="flex items-center justify-between border-t border-white/10 pt-4">
            <span class="font-semibold text-white">จำนวนเงินที่คืน</span>
            <span class="text-2xl font-bold text-emerald-200">{{ returnItem.refundAmount || 0 }} ฿</span>
          </div>
        </div>
      </div>

      <div v-else class="glass-card rounded-3xl border-white/10 p-12 text-center text-slate-300">
        <p class="text-lg">ไม่มีรายการคืนสินค้า</p>
        <router-link to="/rentals" class="primary-btn mt-4 inline-flex px-6 py-2">ดูรายการเช่า</router-link>
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
    PENDING: 'border-amber-300/50 bg-amber-300/10 text-amber-100',
    INSPECTING: 'border-sky-300/50 bg-sky-300/10 text-sky-100',
    COMPLETED: 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100',
    REJECTED: 'border-red-400/60 bg-red-400/10 text-red-100',
  };
  return classes[status] || 'border-white/10 bg-white/5 text-slate-200';
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
