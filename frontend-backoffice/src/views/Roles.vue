<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-4xl font-bold">จัดการสิทธิ์</h1>
      <button @click="showModal = true" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        + สร้างบทบาทใหม่
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">บทบาทและสิทธิ์</h2>
      <p class="text-gray-600 mb-4">กำหนดบทบาทและสิทธิ์การเข้าถึงระบบ</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div class="border rounded-lg p-6">
          <h3 class="font-bold text-lg mb-2">Admin</h3>
          <p class="text-sm text-gray-600 mb-4">สิทธิ์เต็ม สามารถจัดการทุกอย่างได้</p>
          <button class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">แก้ไข</button>
        </div>

        <div class="border rounded-lg p-6">
          <h3 class="font-bold text-lg mb-2">Manager</h3>
          <p class="text-sm text-gray-600 mb-4">จัดการสินค้าและรายการเช่า</p>
          <button class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">แก้ไข</button>
        </div>

        <div class="border rounded-lg p-6">
          <h3 class="font-bold text-lg mb-2">Staff</h3>
          <p class="text-sm text-gray-600 mb-4">ดูข้อมูลและอัพเดทสถานะ</p>
          <button class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">แก้ไข</button>
        </div>
      </div>
    </div>

    <!-- Create Role Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">สร้างบทบาทใหม่</h2>
        <form @submit.prevent="createRole" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">ชื่อบทบาท *</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">คำอธิบาย</label>
            <textarea v-model="form.description" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
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
import { adminAPI } from '@/services/api';

const showModal = ref(false);
const form = ref({ name: '', description: '' });

const createRole = async () => {
  try {
    await adminAPI.createRole(form.value);
    alert('สร้างบทบาทเรียบร้อยแล้ว');
    showModal.value = false;
    form.value = { name: '', description: '' };
  } catch (error) {
    console.error('Error creating role:', error);
    alert('เกิดข้อผิดพลาด');
  }
};
</script>
