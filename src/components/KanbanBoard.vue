<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCandidaturesStore } from '../stores/candidatures'
import { useReferenceStore } from '../stores/reference'
import KanbanCard from './KanbanCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorBanner from '../components/ErrorBanner.vue'

const candidatures = useCandidaturesStore()
const reference = useReferenceStore()

const draggedId = ref<number | null>(null)
const dragOverStatut = ref<string | null>(null)

const colonnes = computed(() =>
  reference.statuts.map((statut) => ({
    statut,
    candidatures: candidatures.kanbanItems.filter((c) => c.statut === statut.nom),
  })),
)

function handleDragStart(id: number, event: DragEvent) {
  draggedId.value = id
  event.dataTransfer?.setData('text/plain', String(id))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}

function handleDragEnd() {
  draggedId.value = null
  dragOverStatut.value = null
}

function handleDrop(statutNom: string, event: DragEvent) {
  const idRaw = event.dataTransfer?.getData('text/plain')
  dragOverStatut.value = null
  if (!idRaw) return
  candidatures.moveCandidatureStatut(Number(idRaw), statutNom)
}
</script>

<template>
  <div class="kanban-wrapper">
    <LoadingSpinner v-if="candidatures.kanbanLoading && candidatures.kanbanItems.length === 0" label="Chargement du tableau…" />

    <ErrorBanner
      v-else-if="candidatures.kanbanError"
      :message="candidatures.kanbanError"
      @retry="candidatures.loadKanban()"
    />

    <div v-else class="kanban-board">
      <section
        v-for="colonne in colonnes"
        :key="colonne.statut.id"
        class="kanban-column"
        :class="{ 'is-drag-over': dragOverStatut === colonne.statut.nom }"
        @dragover.prevent="dragOverStatut = colonne.statut.nom"
        @dragleave="dragOverStatut = dragOverStatut === colonne.statut.nom ? null : dragOverStatut"
        @drop="handleDrop(colonne.statut.nom, $event)"
      >
        <header class="kanban-column-header" :style="{ '--statut-color': colonne.statut.couleur }">
          <span class="dot" aria-hidden="true"></span>
          <h3>{{ colonne.statut.nom }}</h3>
          <span class="count">{{ colonne.candidatures.length }}</span>
        </header>

        <div class="kanban-column-body">
          <KanbanCard
            v-for="candidature in colonne.candidatures"
            :key="candidature.id"
            :candidature="candidature"
            :dragging="draggedId === candidature.id"
            @dragstart="handleDragStart(candidature.id, $event)"
            @dragend="handleDragEnd"
          />
          <p v-if="colonne.candidatures.length === 0" class="kanban-empty">Aucun candidat</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.kanban-wrapper {
  min-height: 12rem;
}

.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.kanban-column {
  flex: 0 0 17rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.9rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.kanban-column.is-drag-over {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-alt));
}

.kanban-column-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.15rem;
}

.kanban-column-header .dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--statut-color);
  flex-shrink: 0;
}

.kanban-column-header h3 {
  flex: 1;
  margin: 0;
  font-size: 0.9rem;
}

.kanban-column-header .count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  padding: 0.1rem 0.5rem;
}

.kanban-column-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 4rem;
}

.kanban-empty {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  padding: 1rem 0;
  margin: 0;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
}
</style>
