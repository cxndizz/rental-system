<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showNotifications = ref(false)
const showUserMenu = ref(false)

const pageTitle = computed(() => {
  const routeName = route.name
  if (!routeName) return 'Dashboard'

  // Convert route name to title
  const titles = {
    dashboard: 'Dashboard',
    items: 'Items Management',
    'items-create': 'Create Item',
    'items-edit': 'Edit Item',
    categories: 'Categories Management',
    rentals: 'Rentals Management',
    'rental-detail': 'Rental Details',
    returns: 'Returns Management',
    customers: 'Customers Management',
    'customer-detail': 'Customer Details',
    payments: 'Payments Management',
    promotions: 'Promotions Management',
    content: 'Content Management',
    notifications: 'Notifications',
    roles: 'Roles & Permissions',
    reports: 'Reports',
    settings: 'System Settings',
    audit: 'Audit Log',
  }

  return titles[routeName] || 'Admin Panel'
})

const adminUser = computed(() => {
  // In real app, this would come from auth store
  return {
    name: 'Admin User',
    email: 'admin@rental.com',
    role: 'Super Admin',
  }
})

const notifications = ref([
  { id: 1, message: 'New rental order #1234', time: '5 min ago', read: false },
  { id: 2, message: 'Return inspection needed', time: '10 min ago', read: false },
  { id: 3, message: 'Payment received', time: '1 hour ago', read: true },
])

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
</script>

<template>
  <header class="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
    <div class="px-4 sm:px-8">
      <div class="flex items-center justify-between h-20">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-amber-300/70">Executive View</p>
          <h1 class="text-2xl font-semibold text-white">{{ pageTitle }}</h1>
          <p class="text-sm text-slate-300 hidden sm:block">Welcome back, {{ adminUser.name }}</p>
        </div>

        <div class="flex items-center space-x-3">
          <router-link
            to="/items/create"
            class="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 text-slate-950 font-semibold shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 transition"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Item
          </router-link>

          <div class="relative">
            <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 rounded-full bg-white/5 border border-white/10 text-slate-100 hover:border-amber-300/60 hover:text-amber-200 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
              >
                {{ unreadCount }}
              </span>
            </button>

            <div
              v-if="showNotifications"
              class="absolute right-0 mt-3 w-80 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur"
              @click.stop
            >
              <div class="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 class="font-semibold text-white">Notifications</h3>
                <span class="text-xs text-amber-200/80">Curated updates</span>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="[
                    'p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition',
                    !notification.read ? 'bg-amber-500/5' : '',
                  ]"
                >
                  <p class="text-sm text-white">{{ notification.message }}</p>
                  <p class="text-xs text-slate-300 mt-1">{{ notification.time }}</p>
                </div>
              </div>
              <router-link
                to="/notifications"
                class="block p-3 text-center text-sm text-amber-200 hover:bg-white/5 font-semibold"
                @click="showNotifications = false"
              >
                View all activity
              </router-link>
            </div>
          </div>

          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:border-amber-300/60 transition"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
                <span class="text-slate-950 font-semibold text-sm">{{ adminUser.name.charAt(0) }}</span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-semibold text-white">{{ adminUser.name }}</p>
                <p class="text-xs text-slate-300">{{ adminUser.role }}</p>
              </div>
              <svg class="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-3 w-60 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur"
              @click.stop
            >
              <div class="p-4 border-b border-white/10">
                <p class="text-sm font-semibold text-white">{{ adminUser.name }}</p>
                <p class="text-xs text-slate-300">{{ adminUser.email }}</p>
              </div>
              <div class="py-1">
                <router-link
                  to="/settings"
                  class="flex items-center px-4 py-2 text-sm text-slate-100 hover:bg-white/5"
                  @click="showUserMenu = false"
                >
                  <svg class="w-4 h-4 mr-3 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </router-link>
                <a href="#" class="flex items-center px-4 py-2 text-sm text-slate-100 hover:bg-white/5">
                  <svg
                    class="w-4 h-4 mr-3 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Help & Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
