<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// ไม่แสดง Sidebar/Header ในหน้า Login
const isLoginPage = computed(() => route.name === 'admin-login')
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Login Page (Full Screen) -->
    <template v-if="isLoginPage">
      <router-view />
    </template>

    <!-- Dashboard Layout (Sidebar + Main Content) -->
    <template v-else>
      <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <Sidebar />

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Header -->
          <Header />

          <!-- Page Content -->
          <main class="flex-1 overflow-y-auto bg-gray-50">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <router-view />
            </div>
          </main>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar for main content */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f1f1f1;
}

main::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
