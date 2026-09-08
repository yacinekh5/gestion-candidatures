<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-banner" role="alert">
    <p>⚠️ {{ message }}</p>
    <button type="button" @click="emit('retry')">Réessayer</button>
  </div>
</template>

<style scoped>
.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-danger) 10%, var(--color-surface));
  border: 1px solid color-mix(in srgb, var(--color-danger) 35%, transparent);
  color: var(--color-danger);
}

.error-banner p {
  margin: 0;
}

.error-banner button {
  flex-shrink: 0;
  border: 1px solid var(--color-danger);
  background: transparent;
  color: var(--color-danger);
  border-radius: var(--radius-sm);
  padding: 0.45rem 1rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
}

.error-banner button:hover {
  background: var(--color-danger);
  color: white;
}
</style>
