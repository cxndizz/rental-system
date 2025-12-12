<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(true)

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    path: '/',
  },
  {
    label: 'Items',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    path: '/items',
  },
  {
    label: 'Categories',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    path: '/categories',
  },
  {
    label: 'Rentals',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    path: '/rentals',
  },
  {
    label: 'Returns',
    icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
    path: '/returns',
  },
  {
    label: 'Customers',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    path: '/customers',
  },
  {
    label: 'Payments',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    path: '/payments',
  },
  {
    label: 'Promotions',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    path: '/promotions',
  },
  {
    label: 'Content',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    path: '/content',
  },
  {
    label: 'Notifications',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    path: '/notifications',
  },
  {
    label: 'Roles & Permissions',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    path: '/roles',
  },
  {
    label: 'Reports',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    path: '/reports',
  },
  {
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    path: '/settings',
  },
  {
    label: 'Audit Log',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    path: '/audit',
  },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/login')
}
</script>

<template>
  <aside
    :class="[
      'bg-slate-950/80 text-white transition-all duration-300 flex flex-col backdrop-blur-xl border-r border-white/10 shadow-2xl shadow-black/30',
      isSidebarOpen ? 'w-72' : 'w-24',
    ]"
    class="h-screen sticky top-0"
  >
    <div class="p-5 border-b border-white/10 flex items-center justify-between">
      <router-link to="/" class="flex items-center space-x-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-400 to-fuchsia-500 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-lg shadow-rose-500/30">
          R
        </div>
        <div v-if="isSidebarOpen">
          <p class="text-xs uppercase tracking-[0.2em] text-amber-200/70">Rental Ops</p>
          <span class="font-semibold text-lg">Admin Panel</span>
        </div>
      </router-link>
      <button
        @click="isSidebarOpen = !isSidebarOpen"
        class="text-amber-200/80 hover:text-white lg:hidden bg-white/5 border border-white/10 rounded-full p-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'relative flex items-center px-4 py-3 mb-2 rounded-2xl transition group border border-transparent',
          isActive(item.path)
            ? 'bg-white/10 border-white/15 shadow-lg shadow-amber-500/10 text-white'
            : 'text-slate-200 hover:bg-white/5 hover:border-white/10',
        ]"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-amber-200 shadow-inner shadow-black/30">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
        </span>
        <span v-if="isSidebarOpen" class="ml-3 font-semibold tracking-tight">{{ item.label }}</span>
        <span
          v-else
          class="absolute left-24 bg-slate-950 px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl"
        >
          {{ item.label }}
        </span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-white/10">
      <button
        @click="logout"
        class="flex items-center w-full px-4 py-3 rounded-2xl text-rose-100 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="isSidebarOpen" class="ml-3 font-semibold">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #e2e8f0;
}
</style>
