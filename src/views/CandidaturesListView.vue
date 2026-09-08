<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCandidaturesStore } from '../stores/candidatures'
import { useReferenceStore } from '../stores/reference'
import { usePreferencesStore } from '../stores/preferences'
import type { ViewMode } from '../stores/preferences'
import SearchBar from '../components/SearchBar.vue'
import FiltersPanel from '../components/FiltersPanel.vue'
import CandidatureCard from '../components/CandidatureCard.vue'
import PaginationControls from '../components/PaginationControls.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import ErrorBanner from '../components/ErrorBanner.vue'
import KanbanBoard from '../components/KanbanBoard.vue'

const candidatures = useCandidaturesStore()
const reference = useReferenceStore()
const preferences = usePreferencesStore()

const totalAffiche = computed(() =>
  preferences.viewMode === 'liste' ? candidatures.totalCount : candidatures.kanbanItems.length,
)

function refresh(page = 1) {
  return preferences.viewMode === 'liste' ? candidatures.loadList(page) : candidatures.loadKanban()
}

const search = computed({
  get: () => preferences.filters.q,
  set: (value: string) => {
    preferences.setFilters({ q: value })
    refresh()
  },
})

function handleFiltersChange() {
  refresh()
}

function handlePageChange(page: number) {
  candidatures.loadList(page)
}

function switchView(mode: ViewMode) {
  if (mode === preferences.viewMode) return
  preferences.setViewMode(mode)
  refresh()
}

onMounted(async () => {
  await reference.loadAll()
  await refresh(candidatures.page)
})
</script>

<template>
  <section class="list-view">
    <header class="page-intro">
      <div>
        <h1>Candidatures</h1>
        <p>Suivez, filtrez et faites avancer les candidatures de votre pipeline de recrutement.</p>
      </div>
      <span class="total-pill">{{ totalAffiche }} candidature{{ totalAffiche > 1 ? 's' : '' }}</span>
    </header>

    <div class="toolbar-card">
      <div class="toolbar-top">
        <SearchBar v-model="search" />
        <div class="view-toggle" role="group" aria-label="Mode d'affichage">
          <button
            type="button"
            :class="{ active: preferences.viewMode === 'liste' }"
            @click="switchView('liste')"
          >
            ☰ Liste
          </button>
          <button
            type="button"
            :class="{ active: preferences.viewMode === 'kanban' }"
            @click="switchView('kanban')"
          >
            ▤ Kanban
          </button>
        </div>
      </div>
      <FiltersPanel :mode="preferences.viewMode" @change="handleFiltersChange" />
    </div>

    <template v-if="preferences.viewMode === 'kanban'">
      <KanbanBoard />
    </template>

    <template v-else>
      <div v-if="candidatures.loading && candidatures.items.length === 0" class="candidatures-grid">
        <SkeletonCard v-for="n in 6" :key="n" />
      </div>

      <ErrorBanner
        v-else-if="candidatures.error"
        :message="candidatures.error"
        @retry="candidatures.loadList(candidatures.page)"
      />

      <template v-else>
        <p v-if="candidatures.items.length === 0" class="empty-state">
          <span class="empty-emoji">🔍</span>
          Aucune candidature ne correspond à ces critères.
        </p>
        <div v-else class="candidatures-grid" :aria-busy="candidatures.loading">
          <CandidatureCard
            v-for="candidature in candidatures.items"
            :key="candidature.id"
            :candidature="candidature"
          />
        </div>

        <PaginationControls
          v-if="candidatures.items.length > 0"
          :page="candidatures.page"
          :total-pages="candidatures.totalPages"
          :total-count="candidatures.totalCount"
          @change="handlePageChange"
        />
      </template>
    </template>
  </section>
</template>

<style scoped>
.list-view {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.page-intro {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.page-intro h1 {
  margin: 0 0 0.35rem;
  font-size: 1.9rem;
}

.page-intro p {
  margin: 0;
  color: var(--color-text-muted);
}

.total-pill {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
}

.toolbar-card {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.toolbar-top {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.toolbar-top .search-bar {
  flex: 1;
  min-width: 14rem;
}

.view-toggle {
  display: inline-flex;
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.view-toggle button {
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-pill);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.view-toggle button.active {
  background: var(--gradient-brand);
  color: white;
}

.candidatures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  color: var(--color-text-muted);
  padding: 4rem 0;
}

.empty-emoji {
  font-size: 2.5rem;
}
</style>
