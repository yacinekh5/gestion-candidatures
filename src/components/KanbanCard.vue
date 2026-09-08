<script setup lang="ts">
import { computed } from 'vue'
import type { Candidature } from '../types'
import { getHue, getInitiales } from '../utils/avatar'

const props = defineProps<{ candidature: Candidature; dragging: boolean }>()
defineEmits<{
  dragstart: [event: DragEvent]
  dragend: []
}>()

const initiales = computed(() => getInitiales(props.candidature.nom))
const hueSeed = computed(() => getHue(props.candidature.nom))
const dateFormatee = computed(() =>
  new Date(props.candidature.dateCandidature).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
)
</script>

<template>
  <router-link
    :to="{ name: 'candidature-detail', params: { id: candidature.id } }"
    class="kanban-card"
    :class="{ 'is-dragging': dragging }"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend')"
  >
    <div class="kanban-card-top">
      <div class="avatar-sm" :style="{ '--hue': hueSeed }">{{ initiales }}</div>
      <div>
        <p class="kanban-card-nom">{{ candidature.nom }}</p>
        <p class="kanban-card-poste">{{ candidature.poste }}</p>
      </div>
    </div>
    <ul class="kanban-card-competences">
      <li v-for="competence in candidature.competences.slice(0, 3)" :key="competence">{{ competence }}</li>
    </ul>
    <div class="kanban-card-footer">
      <span>📍 {{ candidature.localisation }}</span>
      <span>{{ candidature.experience }}</span>
      <span>{{ dateFormatee }}</span>
    </div>
  </router-link>
</template>

<style scoped>
.kanban-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: inherit;
  text-decoration: none;
  cursor: grab;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}

.kanban-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.kanban-card.is-dragging {
  opacity: 0.4;
  cursor: grabbing;
}

.kanban-card-top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.avatar-sm {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.7rem;
  color: white;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 55%), hsl(calc(var(--hue) + 40) 70% 45%));
}

.kanban-card-nom {
  margin: 0;
  font-size: 0.87rem;
  font-weight: 600;
}

.kanban-card-poste {
  margin: 0.1rem 0 0;
  font-size: 0.76rem;
  color: var(--color-text-muted);
}

.kanban-card-competences {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.kanban-card-competences li {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
}

.kanban-card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.72rem;
  color: var(--color-text-muted);
  padding-top: 0.5rem;
  border-top: 1px dashed var(--color-border);
}
</style>
