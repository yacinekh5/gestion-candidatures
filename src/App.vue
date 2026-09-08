<script setup lang="ts">
import { watchEffect } from 'vue'
import { usePreferencesStore } from './stores/preferences'
import AppHeader from './components/AppHeader.vue'

const preferences = usePreferencesStore()

watchEffect(() => {
  document.documentElement.dataset.theme = preferences.darkMode ? 'dark' : 'light'
})
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
.app-main {
  max-width: 76rem;
  margin: 0 auto;
  padding: 2rem 1.75rem 4rem;
}
</style>
