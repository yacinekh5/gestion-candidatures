<script setup lang="ts">
import { computed } from 'vue'
import type { Candidature } from '../types'
import { getHue, getInitiales } from '../utils/avatar'
import StatusBadge from './StatusBadge.vue'

const props = defineProps<{ candidature: Candidature }>()

const dateFormatee = computed(() =>
  new Date(props.candidature.dateCandidature).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
)

const initiales = computed(() => getInitiales(props.candidature.nom))
const hueSeed = computed(() => getHue(props.candidature.nom))
</script>

<template>
  <router-link
    :to="{ name: 'candidature-detail', params: { id: candidature.id } }"
    class="candidature-card"
  >
    <div class="card-top">
      <div class="avatar" :style="{ '--hue': hueSeed }">{{ initiales }}</div>
      <div class="card-title">
        <h3>{{ candidature.nom }}</h3>
        <p class="card-poste">{{ candidature.poste }}</p>
        <StatusBadge :statut="candidature.statut" />
      </div>
    </div>

    <ul class="card-competences">
      <li v-for="competence in candidature.competences.slice(0, 4)" :key="competence">
        {{ competence }}
      </li>
      <li v-if="candidature.competences.length > 4" class="more">
        +{{ candidature.competences.length - 4 }}
      </li>
    </ul>

    <div class="card-footer">
      <span>📍 {{ candidature.localisation }}</span>
      <span>{{ candidature.experience }}</span>
      <span>{{ dateFormatee }}</span>
    </div>
  </router-link>
</template>

<style scoped>
.candidature-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: inherit;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

.candidature-card:hover,
.candidature-card:focus-visible {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.candidature-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.avatar {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 55%), hsl(calc(var(--hue) + 40) 70% 45%));
}

.card-title {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

.card-title h3 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.card-poste {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.87rem;
  line-height: 1.3;
}

.card-competences {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.card-competences li {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-alt);
  color: var(--color-text-muted);
}

.card-competences li.more {
  background: transparent;
  color: var(--color-primary);
}

.card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--color-border);
}
</style>
