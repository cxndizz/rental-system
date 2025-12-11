<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// ไม่แสดง Header/Footer ในหน้า Login และ Register
const hideLayout = computed(() => {
  return ['login', 'register'].includes(route.name)
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <Header v-if="!hideLayout" />
    <main :class="hideLayout ? '' : 'flex-1'">
      <router-view />
    </main>
    <Footer v-if="!hideLayout" />
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
</style>
