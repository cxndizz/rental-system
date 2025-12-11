<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-4xl font-bold">จัดการการแจ้งเตือน</h1>
      <button @click="showModal = true" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        + ส่งการแจ้งเตือน
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">ระบบการแจ้งเตือน</h2>
      <p class="text-gray-600 mb-4">ส่งการแจ้งเตือนให้กับผู้ใช้ และจัดการเทมเพลต</p>

      <div class="grid grid-cols-2 gap-4">
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-2">การแจ้งเตือนรายบุคคล</h3>
          <p class="text-sm text-gray-600 mb-2">ส่งการแจ้งเตือนถึงผู้ใช้เฉพาะราย</p>
          <button @click="showModal = true" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">ส่ง</button>
        </div>

        <div class="border rounded-lg p-4">
          <h3 class="font-semibold mb-2">การแจ้งเตือนแบบ Broadcast</h3>
          <p class="text-sm text-gray-600 mb-2">ส่งการแจ้งเตือนถึงผู้ใช้ทุกคน</p>
          <button @click="showBroadcastModal = true" class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">ส่ง</button>
        </div>
      </div>
    </div>

    <!-- Send Notification Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">ส่งการแจ้งเตือน</h2>
        <form @submit.prevent="sendNotification" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">หัวข้อ *</label>
            <input v-model="form.title" type="text" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ข้อความ *</label>
            <textarea v-model="form.message" required rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">ส่ง</button>
            <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Broadcast Modal -->
    <div v-if="showBroadcastModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">ส่งการแจ้งเตือนแบบ Broadcast</h2>
        <form @submit.prevent="sendBroadcast" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">หัวข้อ *</label>
            <input v-model="broadcastForm.title" type="text" required class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ข้อความ *</label>
            <textarea v-model="broadcastForm.message" required rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex gap-4">
            <button type="submit" class="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">ส่ง</button>
            <button type="button" @click="showBroadcastModal = false" class="px-4 py-2 bg-gray-200 rounded">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { notificationsAPI } from '@/services/api';

const showModal = ref(false);
const showBroadcastModal = ref(false);
const form = ref({ title: '', message: '' });
const broadcastForm = ref({ title: '', message: '' });

const sendNotification = async () => {
  try {
    await notificationsAPI.send(form.value);
    alert('ส่งการแจ้งเตือนเรียบร้อยแล้ว');
    showModal.value = false;
    form.value = { title: '', message: '' };
  } catch (error) {
    console.error('Error sending notification:', error);
    alert('เกิดข้อผิดพลาด');
  }
};

const sendBroadcast = async () => {
  try {
    await notificationsAPI.broadcast(broadcastForm.value);
    alert('ส่งการแจ้งเตือนเรียบร้อยแล้ว');
    showBroadcastModal.value = false;
    broadcastForm.value = { title: '', message: '' };
  } catch (error) {
    console.error('Error sending broadcast:', error);
    alert('เกิดข้อผิดพลาด');
  }
};
</script>
