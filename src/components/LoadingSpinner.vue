<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="loading" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <span>{{ label ?? 'Chargement en cours…' }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
