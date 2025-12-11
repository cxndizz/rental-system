<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-4xl font-bold">จัดการสินค้า</h1>
      <router-link
        to="/items/create"
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + เพิ่มสินค้าใหม่
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
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
        <select v-model="filters.status" class="px-4 py-2 border rounded-lg" @change="searchItems">
          <option value="">ทุกสถานะ</option>
          <option value="AVAILABLE">พร้อมให้เช่า</option>
          <option value="RENTED">กำลังเช่า</option>
          <option value="MAINTENANCE">ซ่อมบำรุง</option>
          <option value="RETIRED">เลิกใช้</option>
        </select>
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          รีเซ็ต
        </button>
      </div>
    </div>

    <!-- Items Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <table v-else-if="items.length" class="w-full">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">รูปภาพ</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ชื่อสินค้า</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">หมวดหมู่</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ราคา/วัน</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">คลัง</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <img
                :src="item.media?.[0]?.url || 'https://via.placeholder.com/100'"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded"
              />
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold">{{ item.name }}</p>
              <p class="text-sm text-gray-600">{{ item.sku }}</p>
            </td>
            <td class="px-6 py-4">{{ item.category?.name }}</td>
            <td class="px-6 py-4">{{ item.pricePerDay }} ฿</td>
            <td class="px-6 py-4">
              <span :class="item.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                {{ item.quantity }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="getStatusClass(item.status)"
              >
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <router-link
                  :to="`/items/${item.id}/edit`"
                  class="text-blue-600 hover:text-blue-800"
                  title="แก้ไข"
                >
                  ✏️
                </router-link>
                <button
                  @click="deleteItem(item.id)"
                  class="text-red-600 hover:text-red-800"
                  title="ลบ"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">ไม่พบสินค้า</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6 gap-2">
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
  status: '',
  page: 1,
  limit: 20,
});
const pagination = ref({ total: 0, page: 1, limit: 20, totalPages: 1 });

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

const resetFilters = () => {
  filters.value = {
    search: '',
    categoryId: '',
    status: '',
    page: 1,
    limit: 20,
  };
  loadItems();
};

const changePage = (page) => {
  filters.value.page = page;
  loadItems();
};

const deleteItem = async (id) => {
  if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
    try {
      await itemsAPI.delete(id);
      alert('ลบสินค้าเรียบร้อยแล้ว');
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  }
};

const getStatusClass = (status) => {
  const classes = {
    AVAILABLE: 'bg-green-100 text-green-800',
    RENTED: 'bg-blue-100 text-blue-800',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800',
    RETIRED: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status) => {
  const texts = {
    AVAILABLE: 'พร้อมให้เช่า',
    RENTED: 'กำลังเช่า',
    MAINTENANCE: 'ซ่อมบำรุง',
    RETIRED: 'เลิกใช้',
  };
  return texts[status] || status;
};
</script>
