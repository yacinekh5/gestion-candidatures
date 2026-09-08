<script setup lang="ts">
import { computed } from 'vue'
import { useReferenceStore } from '../stores/reference'

const props = defineProps<{ statut: string }>()
const reference = useReferenceStore()
const couleur = computed(() => reference.couleurStatut(props.statut))
</script>

<template>
  <span class="status-badge" :style="{ '--badge-color': couleur }">{{ statut }}</span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.3em 0.8em;
  border-radius: var(--radius-pill, 999px);
  font-size: 0.78em;
  font-weight: 700;
  color: var(--badge-color);
  background-color: color-mix(in srgb, var(--badge-color) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--badge-color) 35%, transparent);
  white-space: nowrap;
  flex-shrink: 0;
}

.status-badge::before {
  content: '';
  width: 0.5em;
  height: 0.5em;
  border-radius: 50%;
  background-color: var(--badge-color);
}
</style>
