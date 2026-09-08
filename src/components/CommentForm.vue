<script setup lang="ts">
import { ref } from 'vue'
import { usePreferencesStore } from '../stores/preferences'

const emit = defineEmits<{ submit: [auteur: string, contenu: string] }>()
defineProps<{ submitting: boolean }>()

const preferences = usePreferencesStore()
const auteur = ref(preferences.auteurNom)
const contenu = ref('')

function handleSubmit() {
  if (!auteur.value.trim() || !contenu.value.trim()) return
  preferences.setAuteurNom(auteur.value.trim())
  emit('submit', auteur.value.trim(), contenu.value.trim())
  contenu.value = ''
}
</script>

<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="comment-auteur">Votre nom</label>
      <input id="comment-auteur" v-model="auteur" type="text" required placeholder="Ex: Marie Recruteuse" />
    </div>
    <div class="field">
      <label for="comment-contenu">Commentaire</label>
      <textarea
        id="comment-contenu"
        v-model="contenu"
        required
        rows="3"
        placeholder="Ajouter une note sur ce candidat…"
      ></textarea>
    </div>
    <button type="submit" :disabled="submitting">
      {{ submitting ? 'Envoi…' : 'Ajouter le commentaire' }}
    </button>
  </form>
</template>

<style scoped>
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.field input,
.field textarea {
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: inherit;
  resize: vertical;
}

.field input:focus-visible,
.field textarea:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.comment-form button {
  align-self: flex-start;
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--gradient-brand);
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.comment-form button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.comment-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
