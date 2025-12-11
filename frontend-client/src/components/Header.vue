<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const searchQuery = ref('')
const mobileMenuOpen = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'items', query: { q: searchQuery.value } })
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:py-5">
      <router-link to="/" class="flex items-center space-x-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-lg font-bold text-slate-900 shadow-lg">
          RS
        </div>
        <div class="hidden sm:block">
          <p class="text-sm uppercase tracking-[0.35em] text-amber-200">Rental Suite</p>
          <p class="text-lg font-semibold text-white">Luxury Rentals Platform</p>
        </div>
      </router-link>

      <div class="hidden flex-1 items-center justify-center px-8 md:flex">
        <div class="glass-card flex w-full max-w-2xl items-center space-x-3 rounded-2xl px-4 py-3">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="ค้นหาสินค้าแบบพรีเมียม..."
            class="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            @click="handleSearch"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <nav class="hidden items-center space-x-4 md:flex">
        <router-link to="/items" class="ghost-btn px-4 py-2 text-sm">Browse</router-link>
        <template v-if="isLoggedIn">
          <router-link to="/wishlist" class="ghost-btn px-3 py-2">
            <span class="sr-only">Wishlist</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </router-link>
          <router-link to="/notifications" class="ghost-btn px-3 py-2">
            <span class="sr-only">Notifications</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.676 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </router-link>
          <router-link to="/dashboard" class="primary-btn">พอร์ทัลของฉัน</router-link>
          <button @click="logout" class="ghost-btn">ออกจากระบบ</button>
        </template>
        <template v-else>
          <router-link to="/login" class="ghost-btn">เข้าสู่ระบบ</router-link>
          <router-link to="/register" class="primary-btn">สมัครสมาชิก</router-link>
        </template>
      </nav>

      <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden rounded-xl border border-white/20 p-2 text-white">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/10 bg-slate-900/90 backdrop-blur-xl">
      <div class="space-y-4 px-4 py-4">
        <div class="glass-card flex items-center space-x-3 px-4 py-3">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch; mobileMenuOpen = false"
            type="text"
            placeholder="ค้นหาสินค้าแบบพรีเมียม..."
            class="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button @click="handleSearch" class="text-amber-300">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <router-link to="/items" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
          Browse Items
        </router-link>
        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
            พอร์ทัลของฉัน
          </router-link>
          <router-link to="/rentals" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
            การเช่าของฉัน
          </router-link>
          <router-link to="/wishlist" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
            Wishlist
          </router-link>
          <router-link to="/notifications" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
            การแจ้งเตือน
          </router-link>
          <router-link to="/support" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
            ฝ่ายบริการ
          </router-link>
          <button @click="logout(); mobileMenuOpen = false" class="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-300 hover:bg-white/10">
            ออกจากระบบ
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="block rounded-xl px-4 py-3 text-sm font-semibold text-white hover:bg-white/10" @click="mobileMenuOpen = false">
            เข้าสู่ระบบ
          </router-link>
          <router-link to="/register" class="block rounded-xl px-4 py-3 text-sm font-semibold text-amber-200 hover:bg-white/10" @click="mobileMenuOpen = false">
            สมัครสมาชิก
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  color: #fcd34d;
}
</style>
