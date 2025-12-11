<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8">Wishlist ของฉัน</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="wishlist.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in wishlist"
          :key="item.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
        >
          <div class="relative">
            <img
              :src="item.item?.media?.[0]?.url || 'https://via.placeholder.com/300'"
              :alt="item.item?.name"
              class="w-full h-48 object-cover"
            />
            <button
              @click="removeFromWishlist(item.id)"
              class="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-50 transition"
              title="ลบออกจาก Wishlist"
            >
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ item.item?.name }}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.item?.description }}</p>
            <div class="flex justify-between items-center mb-3">
              <span class="text-blue-600 font-bold text-lg">{{ item.item?.pricePerDay }} ฿/วัน</span>
              <span class="text-sm text-gray-500">
                ⭐ {{ item.item?.averageRating?.toFixed(1) || 'N/A' }}
              </span>
            </div>
            <div class="flex gap-2">
              <router-link
                :to="`/items/${item.itemId}`"
                class="flex-1 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition text-sm"
              >
                ดูรายละเอียด
              </router-link>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              เพิ่มเมื่อ: {{ formatDate(item.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p class="text-gray-600 text-lg mb-4">Wishlist ของคุณว่างเปล่า</p>
        <router-link
          to="/items"
          class="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          เรียกดูสินค้า
        </router-link>
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
    // Load from localStorage for now (since we don't have API endpoint)
    const stored = localStorage.getItem(`wishlist_${user.id}`);
    wishlist.value = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading wishlist:', error);
  } finally {
    loading.value = false;
  }
};

const removeFromWishlist = (id) => {
  if (confirm('คุณต้องการลบรายการนี้ออกจาก Wishlist ใช่หรือไม่?')) {
    wishlist.value = wishlist.value.filter(item => item.id !== id);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist.value));
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH');
};
</script>
