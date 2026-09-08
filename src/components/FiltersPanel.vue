<script setup lang="ts">
import { useReferenceStore } from '../stores/reference'
import { usePreferencesStore } from '../stores/preferences'
import type { CandidaturesFilters } from '../types'
import DateRangeFilter from './DateRangeFilter.vue'

withDefaults(defineProps<{ mode?: 'liste' | 'kanban' }>(), { mode: 'liste' })
const emit = defineEmits<{ change: [] }>()
const reference = useReferenceStore()
const preferences = usePreferencesStore()

function update(key: keyof CandidaturesFilters, value: string) {
  preferences.setFilters({ [key]: value } as never)
  emit('change')
}

function updateDateRange(range: { dateDebut: string; dateFin: string }) {
  preferences.setFilters(range)
  emit('change')
}

function reset() {
  preferences.resetFilters()
  emit('change')
}
</script>

<template>
  <fieldset class="filters-panel">
    <legend class="visually-hidden">Filtrer les candidatures</legend>

    <div v-if="mode === 'liste'" class="filter-field">
      <label for="filter-statut">Statut</label>
      <select
        id="filter-statut"
        :value="preferences.filters.statut"
        @change="update('statut', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Tous</option>
        <option v-for="statut in reference.statuts" :key="statut.id" :value="statut.nom">
          {{ statut.nom }}
        </option>
      </select>
    </div>

    <div class="filter-field">
      <label for="filter-poste">Poste</label>
      <select
        id="filter-poste"
        :value="preferences.filters.poste"
        @change="update('poste', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Tous</option>
        <option v-for="poste in reference.postes" :key="poste.id" :value="poste.titre">
          {{ poste.titre }}
        </option>
      </select>
    </div>

    <div class="filter-field">
      <label for="filter-competence">Compétence</label>
      <select
        id="filter-competence"
        :value="preferences.filters.competence"
        @change="update('competence', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Toutes</option>
        <option v-for="competence in reference.competences" :key="competence.id" :value="competence.nom">
          {{ competence.nom }}
        </option>
      </select>
    </div>

    <div class="filter-field">
      <span class="filter-field-label" aria-hidden="true">Période</span>
      <DateRangeFilter
        :date-debut="preferences.filters.dateDebut"
        :date-fin="preferences.filters.dateFin"
        @change="updateDateRange"
      />
    </div>

    <div v-if="mode === 'liste'" class="filter-field">
      <label for="filter-sort">Trier par</label>
      <select
        id="filter-sort"
        :value="preferences.filters.sort"
        @change="update('sort', ($event.target as HTMLSelectElement).value)"
      >
        <option value="dateCandidature">Date de candidature</option>
        <option value="nom">Nom</option>
        <option value="salaireSouhaite">Salaire souhaité</option>
      </select>
    </div>

    <div v-if="mode === 'liste'" class="filter-field">
      <label for="filter-order">Ordre</label>
      <select
        id="filter-order"
        :value="preferences.filters.order"
        @change="update('order', ($event.target as HTMLSelectElement).value)"
      >
        <option value="desc">Décroissant</option>
        <option value="asc">Croissant</option>
      </select>
    </div>

    <button type="button" class="reset-button" @click="reset">Réinitialiser</button>
  </fieldset>
</template>

<style scoped>
.filters-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  border: none;
  padding: 0;
  margin: 0;
  align-items: flex-end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 8.5rem;
}

.filter-field label,
.filter-field-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  font-weight: 700;
}

.filter-field select,
.filter-field input[type='date'] {
  padding: 0.55rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-size: 0.88rem;
  cursor: pointer;
  transition: border-color 0.15s ease;
  color-scheme: light dark;
}

.filter-field select:hover,
.filter-field input[type='date']:hover {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
}

.filter-field select:focus-visible,
.filter-field input[type='date']:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.reset-button {
  padding: 0.55rem 1.1rem;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  height: fit-content;
  font-size: 0.85rem;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.reset-button:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}
</style>
