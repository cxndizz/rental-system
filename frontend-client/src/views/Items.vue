<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8">เรียกดูสินค้า</h1>

      <!-- Filters -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาสินค้า..."
            class="px-4 py-2 border rounded-lg"
            @input="searchItems"
          />
          <select v-model="filters.categoryId" class="px-4 py-2 border rounded-lg" @change="searchItems">
            <option value="">ทุกหมวดหมู่</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
          <input
            v-model="filters.minPrice"
            type="number"
            placeholder="ราคาต่ำสุด"
            class="px-4 py-2 border rounded-lg"
            @input="searchItems"
          />
          <input
            v-model="filters.maxPrice"
            type="number"
            placeholder="ราคาสูงสุด"
            class="px-4 py-2 border rounded-lg"
            @input="searchItems"
          />
        </div>
      </div>

      <!-- Items Grid -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="items.length" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
        >
          <img
            :src="item.media?.[0]?.url || 'https://via.placeholder.com/300'"
            :alt="item.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ item.name }}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="flex justify-between items-center mb-3">
              <span class="text-blue-600 font-bold text-lg">{{ item.pricePerDay }} ฿/วัน</span>
              <span class="text-sm text-gray-500">⭐ {{ item.averageRating?.toFixed(1) || 'N/A' }}</span>
            </div>
            <router-link
              :to="`/items/${item.id}`"
              class="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
            >
              ดูรายละเอียด
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">ไม่พบสินค้า</p>
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
import { ref, onMounted } from 'vue';
import { itemsAPI } from '@/services/api';

const items = ref([]);
const categories = ref([]);
const loading = ref(false);
const filters = ref({
  search: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
  limit: 12,
});
const pagination = ref({ total: 0, page: 1, limit: 12, totalPages: 1 });

onMounted(async () => {
  await loadCategories();
  await loadItems();
});

const loadCategories = async () => {
  try {
    const response = await itemsAPI.getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error loading categories:', error);
  }
};

const loadItems = async () => {
  loading.value = true;
  try {
    const response = await itemsAPI.getAll(filters.value);
    items.value = response.data.items;
    pagination.value = response.data.pagination;
  } catch (error) {
    console.error('Error loading items:', error);
  } finally {
    loading.value = false;
  }
};

const searchItems = () => {
  filters.value.page = 1;
  loadItems();
};

const changePage = (page) => {
  filters.value.page = page;
  loadItems();
};
</script>
