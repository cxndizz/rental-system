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
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Page Title -->
        <div>
          <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-500 hidden sm:block">
            Welcome back, {{ adminUser.name }}
          </p>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Quick Actions -->
          <router-link
            to="/items/create"
            class="hidden sm:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="font-medium">Add Item</span>
          </router-link>

          <!-- Notifications -->
          <div class="relative">
            <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
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
                class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notifications Dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
              @click.stop
            >
              <div class="p-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="[
                    'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition',
                    !notification.read ? 'bg-blue-50' : '',
                  ]"
                >
                  <p class="text-sm text-gray-900">{{ notification.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
                </div>
              </div>
              <router-link
                to="/notifications"
                class="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 font-medium"
                @click="showNotifications = false"
              >
                View All Notifications
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ adminUser.name.charAt(0) }}
                </span>
              </div>
              <div class="hidden md:block text-left">
                <p class="text-sm font-medium text-gray-900">{{ adminUser.name }}</p>
                <p class="text-xs text-gray-500">{{ adminUser.role }}</p>
              </div>
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- User Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
              @click.stop
            >
              <div class="p-4 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">{{ adminUser.name }}</p>
                <p class="text-xs text-gray-500">{{ adminUser.email }}</p>
              </div>
              <div class="py-2">
                <router-link
                  to="/settings"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  <svg
                    class="w-4 h-4 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </router-link>
                <a
                  href="#"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    class="w-4 h-4 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
/* Close dropdowns when clicking outside */
</style>
