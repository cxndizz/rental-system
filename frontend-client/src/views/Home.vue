<template>
  <div class="relative overflow-hidden">
    <section class="mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 pt-4 md:pt-0">
      <div class="glass-card relative overflow-hidden p-8 md:p-12">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(251,191,36,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.18),transparent_30%)]"></div>
        <div class="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center space-x-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">
              Premium Rental Experience
            </div>
            <div class="space-y-4">
              <h1 class="text-4xl font-extrabold leading-tight text-white md:text-5xl">ระบบเช่ายืมออนไลน์ระดับ Luxury</h1>
              <p class="text-lg text-slate-200">
                เช่าสินค้าคุณภาพแบบเอ็นเตอร์ไพรส์ ด้วยดีไซน์ใหม่ที่หรูหรา พร้อมประสบการณ์การใช้งานที่เรียบง่าย
                และปลอดภัย
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <router-link to="/items" class="primary-btn">เริ่มต้นเช่าเลย</router-link>
              <router-link to="/dashboard" class="ghost-btn">ดูแดชบอร์ดของฉัน</router-link>
            </div>
            <div class="flex flex-wrap gap-4 text-sm text-slate-300">
              <div class="flex items-center space-x-2">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>การันตีคุณภาพสินค้า</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="h-2 w-2 rounded-full bg-amber-300"></span>
                <span>ชำระเงินปลอดภัย</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="h-2 w-2 rounded-full bg-sky-300"></span>
                <span>ทีม Concierge ดูแล 24/7</span>
              </div>
            </div>
          </div>
          <div class="glass-card relative overflow-hidden rounded-3xl border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl">
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(251,191,36,0.15),transparent_30%)]"></div>
            <div class="relative space-y-4">
              <div class="flex items-center justify-between">
                <p class="text-sm uppercase tracking-[0.25em] text-amber-200">Realtime Overview</p>
                <span class="pill border-emerald-300/50 bg-emerald-300/10 text-emerald-200">Live</span>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="glass-card border-white/5 bg-white/5 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Active Rentals</p>
                  <p class="mt-2 text-3xl font-bold text-white">124</p>
                  <p class="text-xs text-emerald-300">+12% วันนี้</p>
                </div>
                <div class="glass-card border-white/5 bg-white/5 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Overdue</p>
                  <p class="mt-2 text-3xl font-bold text-white">3</p>
                  <p class="text-xs text-amber-300">ติดตามใกล้ชิด</p>
                </div>
              </div>
              <div class="glass-card border-white/5 bg-white/5 p-4">
                <div class="flex items-center justify-between">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Next Return</p>
                  <span class="pill border-amber-300/50 bg-amber-300/10 text-amber-100">Today</span>
                </div>
                <p class="mt-3 text-lg font-semibold text-white">Camera Kit Pro X</p>
                <p class="text-sm text-slate-300">กำหนดคืน 18:30 น.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="space-y-6">
        <div class="flex flex-col gap-2 text-center">
          <h2 class="section-title">หมวดหมู่สินค้า</h2>
          <p class="section-subtitle">คัดสรรหมวดหมู่ที่ตอบโจทย์การใช้งานทุกสไตล์</p>
        </div>
        <div class="lux-grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4" v-if="categories.length">
          <div
            v-for="category in categories"
            :key="category.id"
            class="glass-card group cursor-pointer p-5 transition hover:-translate-y-1 hover:border-amber-200/40"
            @click="gotoCategory(category.id)"
          >
            <div class="flex items-center justify-between">
              <div class="text-3xl">{{ category.icon || '📦' }}</div>
              <svg class="h-5 w-5 text-amber-200 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-white">{{ category.name }}</h3>
            <p class="text-sm text-slate-300">เลือกไอเท็มที่ใช่ในหมวดนี้</p>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="flex flex-col gap-2 text-center">
          <h2 class="section-title">สินค้าแนะนำ</h2>
          <p class="section-subtitle">ไอเท็มที่ได้รับความนิยมสูงสุดในสัปดาห์นี้</p>
        </div>
        <div class="lux-grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4" v-if="featuredItems.length">
          <div
            v-for="item in featuredItems"
            :key="item.id"
            class="glass-card overflow-hidden transition hover:-translate-y-1 hover:border-amber-200/50"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="item.media?.[0]?.url || 'https://via.placeholder.com/300'" :alt="item.name" class="h-full w-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
              <div class="absolute left-4 top-4 pill border-amber-300/50 bg-amber-300/10 text-amber-100">{{ item.category?.name || 'แนะนำ' }}</div>
            </div>
            <div class="space-y-3 p-5">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">{{ item.name }}</h3>
                <span class="text-xs text-slate-300">⭐ {{ item.averageRating?.toFixed(1) || 'N/A' }}</span>
              </div>
              <p class="text-sm text-slate-300 line-clamp-2">{{ item.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-amber-200">{{ item.pricePerDay }} ฿/วัน</span>
                <router-link :to="`/items/${item.id}`" class="primary-btn px-4 py-2 text-xs">ดูรายละเอียด</router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { itemsAPI } from '@/services/api'

const router = useRouter()
const categories = ref([])
const featuredItems = ref([])

onMounted(async () => {
  try {
    const [categoriesRes, itemsRes] = await Promise.all([
      itemsAPI.getCategories(),
      itemsAPI.getAll({ limit: 8 }),
    ])
    categories.value = categoriesRes.data
    featuredItems.value = itemsRes.data.items
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const gotoCategory = (categoryId) => {
  router.push({ path: '/items', query: { categoryId } })
}
</script>
