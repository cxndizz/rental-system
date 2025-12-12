<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Notification Hub</p>
          <h1 class="text-3xl font-bold">การแจ้งเตือน</h1>
          <p class="text-slate-300">อัปเดตสถานะคำสั่งเช่า โปรโมชัน และข้อมูลสำคัญแบบเรียลไทม์</p>
        </div>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="ghost-btn px-4 py-2 text-sm"
        >
          ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
        </button>
      </div>

      <div v-if="loading" class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">กำลังโหลดข้อมูล...</div>

      <div v-else-if="notifications.length" class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="glass-card rounded-2xl border-white/10 p-5 shadow-xl"
          :class="{ 'border-amber-300/50 bg-amber-300/10': !notification.isRead }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-1 items-start gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
                :class="getIconClass(notification.type)"
              >
                {{ getIcon(notification.type) }}
              </div>
              <div class="space-y-1">
                <h3 class="text-lg font-semibold text-white">{{ notification.title }}</h3>
                <p class="text-sm text-slate-200">{{ notification.message }}</p>
                <p class="text-xs text-slate-400">{{ formatDate(notification.createdAt) }}</p>
              </div>
            </div>
            <button
              v-if="!notification.isRead"
              @click="markAsRead(notification.id)"
              class="text-sm text-amber-200 hover:text-amber-100"
              title="ทำเครื่องหมายว่าอ่านแล้ว"
            >
              ✓
            </button>
          </div>
          <div v-if="notification.actionUrl" class="mt-3">
            <router-link :to="notification.actionUrl" class="primary-btn px-4 py-2 text-xs">ดูรายละเอียด</router-link>
          </div>
        </div>
      </div>

      <div v-else class="glass-card rounded-3xl border-white/10 p-12 text-center text-slate-300">
        <p class="text-lg">ไม่มีการแจ้งเตือน</p>
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
    notifications.value.forEach(n => (n.isRead = true));
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
    ORDER: 'border-amber-300/50 bg-amber-300/10 text-amber-100',
    PAYMENT: 'border-emerald-300/50 bg-emerald-300/10 text-emerald-100',
    RETURN: 'border-purple-300/50 bg-purple-300/10 text-purple-100',
    PROMOTION: 'border-sky-300/50 bg-sky-300/10 text-sky-100',
    SYSTEM: 'border-white/20 bg-white/5 text-slate-200',
  };
  return classes[type] || 'border-white/10 bg-white/5 text-slate-200';
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
