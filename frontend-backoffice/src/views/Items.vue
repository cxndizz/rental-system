<template>
  <div class="min-h-screen text-slate-100 space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-amber-200/80">Inventory intelligence</p>
        <h1 class="text-3xl font-semibold">จัดการสินค้า</h1>
      </div>
      <router-link
        to="/items/create"
        class="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 text-slate-950 font-semibold shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 transition"
      >
        + เพิ่มสินค้าใหม่
      </router-link>
    </div>

    <div class="rounded-2xl bg-slate-900/70 border border-white/10 shadow-2xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="ค้นหาสินค้า..."
          class="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"
          @input="searchItems"
        />
        <select
          v-model="filters.categoryId"
          class="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"
          @change="searchItems"
        >
          <option value="" class="bg-slate-900">ทุกหมวดหมู่</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-slate-900">{{ cat.name }}</option>
        </select>
        <select
          v-model="filters.status"
          class="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-400/60 text-slate-100"
          @change="searchItems"
        >
          <option value="" class="bg-slate-900">ทุกสถานะ</option>
          <option value="AVAILABLE" class="bg-slate-900">พร้อมให้เช่า</option>
          <option value="RENTED" class="bg-slate-900">กำลังเช่า</option>
          <option value="MAINTENANCE" class="bg-slate-900">ซ่อมบำรุง</option>
          <option value="RETIRED" class="bg-slate-900">เลิกใช้</option>
        </select>
        <button
          @click="resetFilters"
          class="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-300/60 transition"
        >
          รีเซ็ต
        </button>
      </div>
    </div>

    <div class="rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-slate-300">กำลังโหลดข้อมูล...</div>

      <table v-else-if="items.length" class="w-full">
        <thead class="bg-white/5 border-b border-white/10">
          <tr class="text-left text-xs font-semibold text-slate-300 uppercase">
            <th class="px-6 py-3">รูปภาพ</th>
            <th class="px-6 py-3">ชื่อสินค้า</th>
            <th class="px-6 py-3">หมวดหมู่</th>
            <th class="px-6 py-3">ราคา/วัน</th>
            <th class="px-6 py-3">คลัง</th>
            <th class="px-6 py-3">สถานะ</th>
            <th class="px-6 py-3 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 divide-white/5">
          <tr v-for="item in items" :key="item.id" class="hover:bg-white/5 transition">
            <td class="px-6 py-4">
              <img
                :src="item.media?.[0]?.url || 'https://via.placeholder.com/100'"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-xl border border-white/10"
              />
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-white">{{ item.name }}</p>
              <p class="text-sm text-slate-300">{{ item.sku }}</p>
            </td>
            <td class="px-6 py-4 text-slate-200">{{ item.category?.name }}</td>
            <td class="px-6 py-4 text-amber-200">{{ item.pricePerDay }} ฿</td>
            <td class="px-6 py-4">
              <span :class="item.quantity > 0 ? 'text-emerald-300' : 'text-rose-300'">
                {{ item.quantity }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-xs font-semibold border" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-3">
                <router-link
                  :to="`/items/${item.id}/edit`"
                  class="text-amber-200 hover:text-white"
                  title="แก้ไข"
                >
                  ✏️
                </router-link>
                <button
                  @click="deleteItem(item.id)"
                  class="text-rose-300 hover:text-white"
                  title="ลบ"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-center py-12 text-slate-300">ไม่พบสินค้า</div>
    </div>

    <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6 gap-2">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="changePage(page)"
        class="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:border-amber-300/60"
        :class="pagination.page === page ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 text-slate-950 font-semibold' : ''"
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
    AVAILABLE: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/40',
    RENTED: 'bg-amber-500/15 text-amber-100 border-amber-400/40',
    MAINTENANCE: 'bg-indigo-500/15 text-indigo-100 border-indigo-400/40',
    RETIRED: 'bg-slate-500/15 text-slate-200 border-slate-400/40',
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
