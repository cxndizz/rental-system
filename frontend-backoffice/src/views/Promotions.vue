<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-4xl font-bold">จัดการโปรโมชั่น</h1>
      <button @click="showModal = true" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        + สร้างโปรโมชั่น
      </button>
    </div>

    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
      <h2 class="text-2xl font-bold mb-4">รายการโปรโมชั่น</h2>
      <p class="text-slate-300">สร้างและจัดการโปรโมชั่น คูปอง และแคมเปญการตลาด</p>

      <div class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">โปรโมชั่นทั้งหมด</h3>
            <p class="text-3xl font-bold">0</p>
          </div>
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">โปรโมชั่นที่ใช้งานอยู่</h3>
            <p class="text-3xl font-bold text-green-600">0</p>
          </div>
          <div class="border rounded-lg p-6">
            <h3 class="font-semibold mb-2">คูปองที่ถูกใช้</h3>
            <p class="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Promotion Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">สร้างโปรโมชั่นใหม่</h2>
        <form @submit.prevent="createPromotion" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">ชื่อโปรโมชั่น *</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ส่วนลด (%) *</label>
            <input v-model.number="form.discount" type="number" required class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100" />
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">สร้าง</button>
            <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { promotionsAPI } from '@/services/api';

const showModal = ref(false);
const form = ref({ name: '', discount: 0 });

const createPromotion = async () => {
  try {
    await promotionsAPI.create(form.value);
    alert('สร้างโปรโมชั่นเรียบร้อยแล้ว');
    showModal.value = false;
    form.value = { name: '', discount: 0 };
  } catch (error) {
    console.error('Error creating promotion:', error);
    alert('เกิดข้อผิดพลาด');
  }
};
</script>
