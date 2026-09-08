<script setup lang="ts">
const props = defineProps<{ page: number; totalPages: number; totalCount: number }>()
const emit = defineEmits<{ change: [page: number] }>()

function go(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) return
  emit('change', page)
}
</script>

<template>
  <nav class="pagination" aria-label="Pagination des candidatures">
    <p class="pagination-summary">{{ totalCount }} candidature(s) · page {{ page }} / {{ totalPages }}</p>
    <div class="pagination-buttons">
      <button type="button" class="nav-btn" :disabled="page <= 1" @click="go(page - 1)" aria-label="Page précédente">
        ‹
      </button>
      <span class="page-pill">{{ page }}</span>
      <button
        type="button"
        class="nav-btn"
        :disabled="page >= totalPages"
        @click="go(page + 1)"
        aria-label="Page suivante"
      >
        ›
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.nav-btn:not(:disabled):hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.page-pill {
  min-width: 2.3rem;
  height: 2.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  background: var(--gradient-brand);
  color: white;
  font-weight: 700;
  padding: 0 0.6rem;
}
</style>
