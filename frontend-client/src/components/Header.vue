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
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <!-- Desktop Navigation -->
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">R</span>
          </div>
          <span class="font-bold text-xl text-gray-800 hidden sm:block">Rental System</span>
        </router-link>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search items..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="handleSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Desktop Menu -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/items" class="text-gray-700 hover:text-blue-600 font-medium">
            Browse Items
          </router-link>
          <template v-if="isLoggedIn">
            <router-link to="/wishlist" class="text-gray-700 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </router-link>
            <router-link to="/notifications" class="text-gray-700 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </router-link>
            <router-link
              to="/dashboard"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Dashboard
            </router-link>
            <button
              @click="logout"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign Up
            </router-link>
          </template>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden text-gray-700 hover:text-blue-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Search -->
      <div class="md:hidden pb-3">
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search items..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
        <nav class="flex flex-col space-y-3">
          <router-link
            to="/items"
            class="text-gray-700 hover:text-blue-600 font-medium py-2"
            @click="mobileMenuOpen = false"
          >
            Browse Items
          </router-link>
          <template v-if="isLoggedIn">
            <router-link
              to="/dashboard"
              class="text-gray-700 hover:text-blue-600 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </router-link>
            <router-link
              to="/rentals"
              class="text-gray-700 hover:text-blue-600 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              My Rentals
            </router-link>
            <router-link
              to="/wishlist"
              class="text-gray-700 hover:text-blue-600 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Wishlist
            </router-link>
            <router-link
              to="/notifications"
              class="text-gray-700 hover:text-blue-600 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Notifications
            </router-link>
            <router-link
              to="/support"
              class="text-gray-700 hover:text-blue-600 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Support
            </router-link>
            <button
              @click="
                logout()
                mobileMenuOpen = false
              "
              class="text-left text-red-600 hover:text-red-700 font-medium py-2"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-700 hover:text-blue-600 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="text-blue-600 hover:text-blue-700 font-medium py-2"
              @click="mobileMenuOpen = false"
            >
              Sign Up
            </router-link>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  color: #2563eb;
}
</style>
