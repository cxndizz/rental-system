<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-4xl font-bold mb-6">ตั้งค่าระบบ</h1>

    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">ตั้งค่าทั่วไป</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">ชื่อเว็บไซต์</label>
            <input v-model="settings.siteName" type="text" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">อีเมลติดต่อ</label>
            <input v-model="settings.contactEmail" type="email" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">โทรศัพท์ติดต่อ</label>
            <input v-model="settings.contactPhone" type="tel" class="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">ตั้งค่าการชำระเงิน</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <input v-model="settings.enableCash" type="checkbox" id="cash" class="mr-2" />
            <label for="cash">เปิดใช้งานการชำระเงินสด</label>
          </div>
          <div class="flex items-center">
            <input v-model="settings.enableTransfer" type="checkbox" id="transfer" class="mr-2" />
            <label for="transfer">เปิดใช้งานการโอนเงิน</label>
          </div>
          <div class="flex items-center">
            <input v-model="settings.enableCreditCard" type="checkbox" id="card" class="mr-2" />
            <label for="card">เปิดใช้งานบัตรเครดิต</label>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">ตั้งค่าการเช่า</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">ระยะเวลาเช่าขั้นต่ำ (วัน)</label>
            <input v-model.number="settings.minRentalDays" type="number" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ระยะเวลาเช่าสูงสุด (วัน)</label>
            <input v-model.number="settings.maxRentalDays" type="number" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ค่าปรับต่อวัน (%)</label>
            <input v-model.number="settings.lateFeePercent" type="number" class="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="saveSettings" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          บันทึกการตั้งค่า
        </button>
        <button @click="loadSettings" class="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300">
          รีเซ็ต
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { configAPI } from '@/services/api';

const settings = ref({
  siteName: '',
  contactEmail: '',
  contactPhone: '',
  enableCash: true,
  enableTransfer: true,
  enableCreditCard: false,
  minRentalDays: 1,
  maxRentalDays: 30,
  lateFeePercent: 10,
});

onMounted(async () => {
  await loadSettings();
});

const loadSettings = async () => {
  try {
    const response = await configAPI.getAll();
    if (response.data) {
      Object.assign(settings.value, response.data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
};

const saveSettings = async () => {
  try {
    for (const [key, value] of Object.entries(settings.value)) {
      await configAPI.update(key, { value });
    }
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('เกิดข้อผิดพลาด');
  }
};
</script>
