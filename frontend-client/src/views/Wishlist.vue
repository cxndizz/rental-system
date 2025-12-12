<template>
  <div class="lux-shell min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div class="flex flex-col gap-2">
        <p class="pill border-amber-200/60 bg-amber-200/10 text-amber-100">Luxury Wishlist</p>
        <h1 class="text-4xl font-bold leading-tight">Wishlist ของฉัน</h1>
        <p class="text-slate-300">บันทึกไอเท็มพรีเมียมที่ต้องการ พร้อมราคาและเรตติ้งล่าสุด</p>
      </div>

      <div v-if="loading" class="glass-card rounded-3xl border-white/10 p-10 text-center text-slate-300">กำลังโหลดข้อมูล...</div>

      <div v-else-if="wishlist.length" class="lux-grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="item in wishlist"
          :key="item.id"
          class="glass-card overflow-hidden rounded-2xl border-white/10 shadow-xl"
        >
          <div class="relative">
            <img :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/300'" :alt="item.item?.name" class="h-48 w-full object-cover" />
            <button
              @click="removeFromWishlist(item.id)"
              class="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-red-200 hover:bg-red-400/20"
              title="ลบออกจาก Wishlist"
            >
              ♥
            </button>
          </div>
          <div class="space-y-2 p-4">
            <h3 class="text-lg font-semibold text-white">{{ item.item?.name }}</h3>
            <p class="text-sm text-slate-300 line-clamp-2">{{ item.item?.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-amber-200 font-bold text-lg">{{ item.item?.pricePerDay }} ฿/วัน</span>
              <span class="text-sm text-slate-300">⭐ {{ item.item?.averageRating?.toFixed(1) || 'N/A' }}</span>
            </div>
            <router-link :to="`/items/${item.itemId}`" class="primary-btn w-full justify-center text-sm">ดูรายละเอียด</router-link>
            <p class="text-xs text-slate-400">เพิ่มเมื่อ: {{ formatDate(item.createdAt) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="glass-card rounded-3xl border-white/10 p-12 text-center text-slate-300">
        <p class="text-lg">Wishlist ของคุณว่างเปล่า</p>
        <router-link to="/items" class="primary-btn mt-4 inline-flex px-6 py-2">เรียกดูสินค้า</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = authStore.user;

const wishlist = ref([]);
const loading = ref(false);

onMounted(async () => {
  await loadWishlist();
});

const loadWishlist = async () => {
  loading.value = true;
  try {
    const stored = localStorage.getItem(`wishlist_${user.id}`);
    wishlist.value = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading wishlist:', error);
  } finally {
    loading.value = false;
  }
};

const removeFromWishlist = (id) => {
  if (confirm('คุณต้องกรลบรายการนี้ออกจาก Wishlist ใช่หรือไม่?')) {
    wishlist.value = wishlist.value.filter(item => item.id !== id);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist.value));
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
