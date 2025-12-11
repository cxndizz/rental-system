<template>
  <div class="mx-auto max-w-7xl px-4 pb-16">
    <div class="flex flex-col gap-4 pb-6 pt-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.25em] text-amber-200">Luxury Catalog</p>
        <h1 class="text-3xl font-bold text-white md:text-4xl">เรียกดูสินค้า</h1>
        <p class="text-slate-300">ค้นหาไอเท็มพรีเมียมด้วยตัวกรองที่คมชัดและอินเทอร์เฟซใหม่</p>
      </div>
      <div class="glass-card hidden items-center space-x-3 rounded-2xl px-4 py-3 md:flex">
        <svg class="h-5 w-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 2c-2.5 0-7 1.25-7 3.75V17a1 1 0 001 1h12a1 1 0 001-1v-3.25C19 11.25 14.5 10 12 10z" />
        </svg>
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Signed In</p>
          <p class="text-sm text-white">พร้อมสิทธิ์การเช่าระดับสมาชิก</p>
        </div>
      </div>
    </div>

    <div class="glass-card mb-8 p-6">
      <div class="lux-grid grid-cols-1 md:grid-cols-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="ค้นหาสินค้าพรีเมียม..."
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200/60"
          @input="searchItems"
        />
        <select
          v-model="filters.categoryId"
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-200/60"
          @change="searchItems"
        >
          <option value="" class="bg-slate-900 text-white">ทุกหมวดหมู่</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-slate-900 text-white">{{ cat.name }}</option>
        </select>
        <input
          v-model="filters.minPrice"
          type="number"
          placeholder="ราคาต่ำสุด"
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200/60"
          @input="searchItems"
        />
        <input
          v-model="filters.maxPrice"
          type="number"
          placeholder="ราคาสูงสุด"
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200/60"
          @input="searchItems"
        />
      </div>
    </div>

    <div v-if="loading" class="glass-card text-center py-12 text-slate-300">กำลังโหลดข้อมูล...</div>

    <div v-else-if="items.length" class="lux-grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="glass-card overflow-hidden transition hover:-translate-y-1 hover:border-amber-200/50"
      >
        <div class="relative h-52 overflow-hidden">
          <img :src="item.media?.[0]?.url || 'https://via.placeholder.com/300'" :alt="item.name" class="h-full w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
          <div class="absolute left-4 top-4 pill border-amber-300/50 bg-amber-300/10 text-amber-100">{{ item.category?.name || 'หมวดหมู่' }}</div>
        </div>
        <div class="space-y-3 p-5">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
              <p class="text-sm text-slate-300 line-clamp-2">{{ item.description }}</p>
            </div>
            <span class="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-200">⭐ {{ item.averageRating?.toFixed(1) || 'N/A' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-amber-200">{{ item.pricePerDay }} ฿/วัน</span>
            <router-link :to="`/items/${item.id}`" class="primary-btn px-4 py-2 text-xs">ดูรายละเอียด</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="glass-card text-center py-12 text-slate-300">ไม่พบสินค้า</div>

    <div v-if="pagination.totalPages > 1" class="mt-10 flex justify-center gap-2">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="changePage(page)"
        class="rounded-xl px-4 py-2 text-sm font-semibold transition"
        :class="pagination.page === page ? 'bg-amber-300 text-slate-900 shadow-lg' : 'glass-card border-white/10 text-white hover:border-amber-200/50'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { itemsAPI } from '@/services/api'

const items = ref([])
const categories = ref([])
const loading = ref(false)
const filters = ref({
  search: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  page: 1,
  limit: 12,
})
const pagination = ref({ total: 0, page: 1, limit: 12, totalPages: 1 })

onMounted(async () => {
  await loadCategories()
  await loadItems()
})

const loadCategories = async () => {
  try {
    const response = await itemsAPI.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const loadItems = async () => {
  loading.value = true
  try {
    const response = await itemsAPI.getAll(filters.value)
    items.value = response.data.items
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error loading items:', error)
  } finally {
    loading.value = false
  }
}

const searchItems = () => {
  filters.value.page = 1
  loadItems()
}

const changePage = (page) => {
  filters.value.page = page
  loadItems()
}
</script>
