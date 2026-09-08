<script setup lang="ts">
import { usePreferencesStore } from '../stores/preferences'

const preferences = usePreferencesStore()
</script>

<template>
  <header class="app-header">
    <router-link to="/" class="brand">
      <span class="brand-mark" aria-hidden="true">✦</span>
      <span class="brand-text">
        <strong>Talent</strong>Board
      </span>
    </router-link>

    <button
      type="button"
      class="theme-switch"
      :class="{ 'is-dark': preferences.darkMode }"
      :aria-pressed="preferences.darkMode"
      aria-label="Basculer le mode sombre"
      @click="preferences.toggleDarkMode()"
    >
      <span class="theme-switch-icon">{{ preferences.darkMode ? '🌙' : '☀️' }}</span>
      <span class="theme-switch-knob"></span>
    </button>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.75rem;
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--color-text);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: var(--radius-sm);
  background: var(--gradient-brand);
  color: white;
  font-size: 1.05rem;
  box-shadow: var(--shadow-sm);
}

.brand-text {
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}

.brand-text strong {
  font-weight: 800;
}

.theme-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 3.4rem;
  height: 1.9rem;
  padding: 0 0.3rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.theme-switch-icon {
  position: absolute;
  right: 0.35rem;
  font-size: 0.75rem;
  line-height: 1;
}

.theme-switch.is-dark .theme-switch-icon {
  left: 0.4rem;
  right: auto;
}

.theme-switch-knob {
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: var(--gradient-brand);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;
}

.theme-switch.is-dark .theme-switch-knob {
  transform: translateX(1.45rem);
}
</style>
