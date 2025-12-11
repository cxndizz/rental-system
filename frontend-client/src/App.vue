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
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.15),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12),transparent_30%)]"></div>
    <div class="relative flex min-h-screen flex-col">
      <Header v-if="!hideLayout" />
      <main :class="hideLayout ? 'flex-1' : 'flex-1 pt-8 md:pt-12'">
        <router-view />
      </main>
      <Footer v-if="!hideLayout" />
    </div>
  </div>
</template>
