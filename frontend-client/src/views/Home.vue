<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-4">ระบบเช่ายืมออนไลน์</h1>
        <p class="text-xl mb-8">เช่าสินค้าคุณภาพ ง่าย สะดวก ปลอดภัย</p>
        <router-link
          to="/items"
          class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
        >
          เริ่มต้นเช่าเลย
        </router-link>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8 text-center">หมวดหมู่สินค้า</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6" v-if="categories.length">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
          @click="gotoCategory(category.id)"
        >
          <div class="text-4xl mb-3">{{ category.icon || '📦' }}</div>
          <h3 class="font-semibold">{{ category.name }}</h3>
        </div>
      </div>
    </div>

    <!-- Featured Items -->
    <div class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8 text-center">สินค้าแนะนำ</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6" v-if="featuredItems.length">
        <div
          v-for="item in featuredItems"
          :key="item.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <img
            :src="item.media?.[0]?.url || 'https://via.placeholder.com/300'"
            :alt="item.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ item.name }}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 font-bold">{{ item.pricePerDay }} ฿/วัน</span>
              <router-link
                :to="`/items/${item.id}`"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                ดูรายละเอียด
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { itemsAPI } from '@/services/api';

const router = useRouter();
const categories = ref([]);
const featuredItems = ref([]);

onMounted(async () => {
  try {
    const [categoriesRes, itemsRes] = await Promise.all([
      itemsAPI.getCategories(),
      itemsAPI.getAll({ limit: 8 }),
    ]);
    categories.value = categoriesRes.data;
    featuredItems.value = itemsRes.data.items;
  } catch (error) {
    console.error('Error loading data:', error);
  }
});

const gotoCategory = (categoryId) => {
  router.push({ path: '/items', query: { categoryId } });
};
</script>
