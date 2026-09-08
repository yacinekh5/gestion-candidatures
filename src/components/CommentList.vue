<script setup lang="ts">
import type { Commentaire } from '../types'

defineProps<{ commentaires: Commentaire[] }>()

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <ol class="comment-list">
    <li v-if="commentaires.length === 0" class="comment-empty">Aucun commentaire pour le moment.</li>
    <li v-for="commentaire in commentaires" :key="commentaire.id" class="comment-item">
      <div class="comment-meta">
        <strong>{{ commentaire.auteur }}</strong>
        <time :datetime="commentaire.date">{{ formatDate(commentaire.date) }}</time>
      </div>
      <p>{{ commentaire.contenu }}</p>
    </li>
  </ol>
</template>

<style scoped>
.comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-left: 2px solid var(--color-border);
}

.comment-empty {
  color: var(--color-text-muted);
  padding-left: 1rem;
}

.comment-item {
  padding: 0.6rem 0 0.6rem 1rem;
  position: relative;
}

.comment-item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 1.1rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.comment-meta time {
  color: var(--color-text-muted);
}

.comment-item p {
  margin: 0;
}
</style>
