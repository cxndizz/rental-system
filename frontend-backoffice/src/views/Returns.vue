<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <h1 class="text-4xl font-bold mb-6">จัดการการคืนสินค้า</h1>

    <div v-if="loading" class="text-center py-12">
      <p class="text-slate-300">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="returns.length" class="space-y-4">
      <div v-for="returnItem in returns" :key="returnItem.id" class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold">{{ returnItem.returnNumber }}</h3>
            <p class="text-slate-300">เลขที่เช่า: {{ returnItem.rentalOrder?.orderNumber }}</p>
          </div>
          <span :class="getStatusClass(returnItem.status)" class="px-3 py-1 rounded text-sm font-semibold">
            {{ getStatusText(returnItem.status) }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-sm text-slate-300">วันที่สร้าง</p>
            <p class="font-semibold">{{ formatDate(returnItem.createdAt) }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-300">ลูกค้า</p>
            <p class="font-semibold">{{ returnItem.rentalOrder?.user?.profile?.firstName }}</p>
          </div>
        </div>

        <div v-if="returnItem.status === 'PENDING'" class="flex gap-2">
          <button
            @click="inspectReturn(returnItem.id, 'COMPLETED', '')"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            รับคืนสำเร็จ
          </button>
          <button
            @click="showDamageModal(returnItem)"
            class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            รายงานความเสียหาย
          </button>
          <button
            @click="inspectReturn(returnItem.id, 'REJECTED', 'ไม่ผ่านการตรวจสอบ')"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ปฏิเสธ
          </button>
        </div>
      </div>
    </div>

    <div v-else class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-12 text-center">
      <p class="text-slate-300">ไม่มีรายการคืนสินค้า</p>
    </div>

    <!-- Damage Report Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">รายงานความเสียหาย</h2>
        <form @submit.prevent="submitDamageReport">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">รายละเอียดความเสียหาย</label>
            <textarea v-model="damageForm.description" rows="4" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">ค่าเสียหาย (฿)</label>
            <input v-model.number="damageForm.amount" type="number" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100" />
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">บันทึก</button>
            <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { returnsAPI } from '@/services/api';

const returns = ref([]);
const loading = ref(false);
const showModal = ref(false);
const selectedReturn = ref(null);
const damageForm = ref({ description: '', amount: 0 });

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

const inspectReturn = async (id, status, notes) => {
  try {
    await returnsAPI.inspect(id, { status, inspectionNotes: notes });
    alert('บันทึกเรียบร้อยแล้ว');
    await loadReturns();
  } catch (error) {
    console.error('Error inspecting return:', error);
    alert('เกิดข้อผิดพลาด');
  }
};

const showDamageModal = (returnItem) => {
  selectedReturn.value = returnItem;
  showModal.value = true;
};

const submitDamageReport = async () => {
  try {
    await returnsAPI.reportDamage(selectedReturn.value.id, damageForm.value);
    await returnsAPI.inspect(selectedReturn.value.id, { status: 'COMPLETED', inspectionNotes: 'มีความเสียหาย' });
    alert('บันทึกรายงานความเสียหายเรียบร้อยแล้ว');
    showModal.value = false;
    await loadReturns();
  } catch (error) {
    console.error('Error reporting damage:', error);
    alert('เกิดข้อผิดพลาด');
  }
};

const getStatusClass = (status) => ({
  PENDING: 'bg-yellow-100 text-yellow-800',
  INSPECTING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}[status] || 'bg-gray-100 text-gray-800');

const getStatusText = (status) => ({
  PENDING: 'รอตรวจสอบ',
  INSPECTING: 'กำลังตรวจสอบ',
  COMPLETED: 'เสร็จสิ้น',
  REJECTED: 'ปฏิเสธ',
}[status] || status);

const formatDate = (date) => new Date(date).toLocaleDateString('th-TH');
</script>
