<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold">การแจ้งเตือน</h1>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="notifications.length" class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          :class="{ 'border-l-4 border-blue-600': !notification.isRead }"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-start gap-3 flex-1">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="getIconClass(notification.type)"
                >
                  {{ getIcon(notification.type) }}
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-1">{{ notification.title }}</h3>
                  <p class="text-gray-700">{{ notification.message }}</p>
                  <p class="text-sm text-gray-500 mt-2">{{ formatDate(notification.createdAt) }}</p>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  v-if="!notification.isRead"
                  @click="markAsRead(notification.id)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                  title="ทำเครื่องหมายว่าอ่านแล้ว"
                >
                  ✓
                </button>
              </div>
            </div>

            <div v-if="notification.actionUrl" class="mt-4">
              <router-link
                :to="notification.actionUrl"
                class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                ดูรายละเอียด
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p class="text-gray-600 text-lg">ไม่มีการแจ้งเตือน</p>
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
import { useAuthStore } from '@/stores/auth';
import { notificationsAPI } from '@/services/api';

const authStore = useAuthStore();
const user = authStore.user;

const notifications = ref([]);
const loading = ref(false);
const pagination = ref({ total: 0, page: 1, limit: 20, totalPages: 1 });

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length;
});

onMounted(async () => {
  await loadNotifications();
});

const loadNotifications = async () => {
  loading.value = true;
  try {
    const response = await notificationsAPI.getUserNotifications(user.id);
    notifications.value = response.data.notifications || response.data;
    pagination.value = response.data.pagination || pagination.value;
  } catch (error) {
    console.error('Error loading notifications:', error);
  } finally {
    loading.value = false;
  }
};

const markAsRead = async (id) => {
  try {
    await notificationsAPI.markAsRead(id);
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const markAllAsRead = async () => {
  try {
    const unread = notifications.value.filter(n => !n.isRead);
    await Promise.all(unread.map(n => notificationsAPI.markAsRead(n.id)));
    notifications.value.forEach(n => n.isRead = true);
  } catch (error) {
    console.error('Error marking all as read:', error);
  }
};

const changePage = (page) => {
  pagination.value.page = page;
  loadNotifications();
};

const getIconClass = (type) => {
  const classes = {
    ORDER: 'bg-blue-100 text-blue-600',
    PAYMENT: 'bg-green-100 text-green-600',
    RETURN: 'bg-purple-100 text-purple-600',
    PROMOTION: 'bg-yellow-100 text-yellow-600',
    SYSTEM: 'bg-gray-100 text-gray-600',
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
};

const getIcon = (type) => {
  const icons = {
    ORDER: '📦',
    PAYMENT: '💰',
    RETURN: '↩️',
    PROMOTION: '🎁',
    SYSTEM: 'ℹ️',
  };
  return icons[type] || 'ℹ️';
};

const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'เมื่อสักครู่';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;
  return d.toLocaleDateString('th-TH');
};
</script>
