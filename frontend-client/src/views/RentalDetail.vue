<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div v-if="loading" class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">กำลังโหลดข้อมูล...</div>

      <div v-else-if="rental" class="glass-card overflow-hidden rounded-3xl border-white/10 shadow-2xl">
        <div class="bg-gradient-to-r from-amber-300/20 via-white/5 to-emerald-300/20 p-6">
          <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Rental Detail</p>
          <h1 class="text-3xl font-bold leading-tight text-white">รายละเอียดการเช่า</h1>
          <p class="text-slate-200">เลขที่: {{ rental.orderNumber }}</p>
        </div>

        <div class="space-y-6 p-6">
          <div class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-start md:justify-between">
            <div class="space-y-1">
              <p class="text-sm text-slate-300">วันที่สร้าง</p>
              <p class="text-lg font-semibold text-white">{{ formatDate(rental.createdAt) }}</p>
              <p class="text-sm text-slate-300">วันที่คืน: {{ rental.returnDate ? formatDate(rental.returnDate) : 'ยังไม่คืน' }}</p>
            </div>
            <span class="pill text-xs" :class="getStatusClass(rental.status)">{{ getStatusText(rental.status) }}</span>
          </div>

          <div class="space-y-3">
            <h2 class="text-xl font-semibold text-white">รายการสินค้า</h2>
            <div
              v-for="item in rental.items"
              :key="item.id"
              class="glass-card flex gap-4 rounded-2xl border-white/5 p-4"
            >
              <img :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/150'" :alt="item.item?.name" class="h-24 w-24 rounded-xl object-cover" />
              <div class="flex-1 space-y-1">
                <h3 class="text-lg font-semibold text-white">{{ item.item?.name }}</h3>
                <p class="text-sm text-slate-300">{{ item.item?.description }}</p>
                <div class="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <span>จำนวน: <strong class="text-white">{{ item.quantity }}</strong></span>
                  <span>ราคา/วัน: <strong class="text-white">{{ item.pricePerDay }} ฿</strong></span>
                  <span>จำนวนวัน: <strong class="text-white">{{ calculateDays(item.startDate, item.endDate) }} วัน</strong></span>
                  <span>รวม: <strong class="text-amber-200">{{ item.subtotal }} ฿</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="glass-card rounded-2xl border-white/10 p-4">
              <h3 class="text-lg font-semibold text-white">ข้อมูลการชำระเงิน</h3>
              <div class="mt-3 space-y-2 text-sm text-slate-300">
                <div class="flex justify-between"><span>ราคาเช่า</span><span class="text-white font-semibold">{{ rental.totalPrice }} ฿</span></div>
                <div class="flex justify-between"><span>ค่ามัดจำ</span><span class="text-white font-semibold">{{ rental.depositAmount || 0 }} ฿</span></div>
                <div class="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-amber-200">
                  <span>รวมทั้งหมด</span>
                  <span>{{ (rental.totalPrice || 0) + (rental.depositAmount || 0) }} ฿</span>
                </div>
              </div>
              <div v-if="rental.invoice" class="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                เลขที่ใบแจ้งหนี้: {{ rental.invoice.invoiceNumber }} | สถานะ: {{ rental.invoice.status }}
              </div>
            </div>

            <div v-if="rental.deliveryAddress" class="glass-card rounded-2xl border-white/10 p-4">
              <h3 class="text-lg font-semibold text-white">ที่อยู่จัดส่ง</h3>
              <p class="mt-2 text-slate-200">{{ rental.deliveryAddress }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <router-link to="/rentals" class="ghost-btn px-4 py-2 text-sm">กลับ</router-link>
            <button
              v-if="rental.status === 'ON_RENT'"
              @click="initiateReturn"
              class="primary-btn px-4 py-2 text-sm"
            >
              คืนสินค้า
            </button>
            <button
              v-if="rental.status === 'COMPLETED' && !rental.hasReview"
              @click="router.push(`/reviews/create?rentalId=${rental.id}`)"
              class="ghost-btn px-4 py-2 text-sm"
            >
              เขียนรีวิว
            </button>
          </div>
        </div>
      </div>

      <div v-else class="glass-card rounded-3xl border-white/10 p-12 text-center text-slate-300">ไม่พบข้อมูลการเช่า</div>
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
