<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ dateDebut: string; dateFin: string }>()
const emit = defineEmits<{ change: [{ dateDebut: string; dateFin: string }] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const presets = [
  { label: '7 derniers jours', days: 7 },
  { label: '30 derniers jours', days: 30 },
  { label: 'Ce mois-ci', days: 'month' as const },
]

function applyPreset(preset: (typeof presets)[number]) {
  const now = new Date()
  let start: Date

  if (preset.days === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    start = new Date(now)
    start.setDate(start.getDate() - preset.days + 1)
  }

  emit('change', { dateDebut: toISODate(start), dateFin: toISODate(now) })
  open.value = false
}

function clear() {
  emit('change', { dateDebut: '', dateFin: '' })
  open.value = false
}

function updateCustom(key: 'dateDebut' | 'dateFin', value: string) {
  emit('change', { dateDebut: props.dateDebut, dateFin: props.dateFin, [key]: value })
}

const hasFilter = computed(() => Boolean(props.dateDebut || props.dateFin))

const buttonLabel = computed(() => {
  if (!hasFilter.value) return 'Toute période'
  const format = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  if (props.dateDebut && props.dateFin) return `${format(props.dateDebut)} → ${format(props.dateFin)}`
  if (props.dateDebut) return `Depuis le ${format(props.dateDebut)}`
  return `Jusqu'au ${format(props.dateFin)}`
})

function handleClickOutside(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <div ref="root" class="date-range-filter">
    <label class="visually-hidden" for="date-range-trigger">Filtrer par période de candidature</label>
    <button
      id="date-range-trigger"
      type="button"
      class="trigger"
      :class="{ 'has-filter': hasFilter }"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span aria-hidden="true">📅</span>
      {{ buttonLabel }}
    </button>

    <div v-if="open" class="popover" role="dialog" aria-label="Choisir une période">
      <div class="presets">
        <button
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          class="preset-btn"
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </button>
        <button type="button" class="preset-btn clear" :disabled="!hasFilter" @click="clear">
          Toute période
        </button>
      </div>

      <div class="custom-range">
        <p class="custom-range-title">Période personnalisée</p>
        <div class="custom-range-fields">
          <label>
            Du
            <input
              type="date"
              :value="dateDebut"
              @change="updateCustom('dateDebut', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label>
            Au
            <input
              type="date"
              :value="dateFin"
              @change="updateCustom('dateFin', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-range-filter {
  position: relative;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s ease;
}

.trigger:hover {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
}

.trigger.has-filter {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.popover {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 16.5rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.presets {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.preset-btn {
  text-align: left;
  padding: 0.5rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.preset-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.preset-btn.clear {
  color: var(--color-text-muted);
}

.preset-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.custom-range {
  border-top: 1px solid var(--color-border);
  padding-top: 0.85rem;
}

.custom-range-title {
  margin: 0 0 0.6rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  font-weight: 700;
}

.custom-range-fields {
  display: flex;
  gap: 0.6rem;
}

.custom-range-fields label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.custom-range-fields input {
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  color-scheme: light dark;
  font-size: 0.8rem;
}
</style>
