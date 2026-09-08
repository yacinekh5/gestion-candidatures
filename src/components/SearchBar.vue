<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const localValue = ref(props.modelValue)
let timeout: ReturnType<typeof setTimeout>

watch(localValue, (value) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => emit('update:modelValue', value), 300)
})

watch(
  () => props.modelValue,
  (value) => {
    if (value !== localValue.value) localValue.value = value
  },
)
</script>

<template>
  <div class="search-bar">
    <span class="search-icon" aria-hidden="true">⌕</span>
    <label for="search-input" class="visually-hidden">Rechercher une candidature</label>
    <input
      id="search-input"
      v-model="localValue"
      type="search"
      placeholder="Rechercher un nom, un poste, une compétence…"
      autocomplete="off"
    />
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.95rem;
  font-size: 1.05rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.4rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.95rem;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-bar input::placeholder {
  color: var(--color-text-muted);
}

.search-bar input:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}
</style>
