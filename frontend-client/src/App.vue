<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const hideLayout = computed(() => {
  return ['login', 'register'].includes(route.name)
})
</script>

<template>
  <div class="lux-shell relative overflow-hidden">
    <div class="relative flex min-h-screen flex-col">
      <Header v-if="!hideLayout" />
      <main :class="hideLayout ? 'flex-1' : 'flex-1 pt-8 md:pt-12'">
        <router-view />
      </main>
      <Footer v-if="!hideLayout" />
    </div>
  </div>
</template>
