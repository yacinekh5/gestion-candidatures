<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCandidaturesStore } from '../stores/candidatures'
import { useReferenceStore } from '../stores/reference'
import { getInitiales } from '../utils/avatar'
import StatusBadge from '../components/StatusBadge.vue'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorBanner from '../components/ErrorBanner.vue'

const props = defineProps<{ id: number }>()
const candidatures = useCandidaturesStore()
const reference = useReferenceStore()

const dateFormatee = computed(() =>
  candidatures.current
    ? new Date(candidatures.current.dateCandidature).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '',
)

const initiales = computed(() => (candidatures.current ? getInitiales(candidatures.current.nom) : ''))

function reload() {
  candidatures.loadDetail(props.id)
}

function handleStatutChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  candidatures.changeStatut(value)
}

function handleAddComment(auteur: string, contenu: string) {
  candidatures.addComment(auteur, contenu)
}

onMounted(async () => {
  await reference.loadAll()
  await candidatures.loadDetail(props.id)
})
</script>

<template>
  <section class="detail-view">
    <router-link to="/" class="back-link">← Retour à la liste</router-link>

    <LoadingSpinner v-if="candidatures.loadingDetail" label="Chargement de la candidature…" />

    <ErrorBanner v-else-if="candidatures.errorDetail" :message="candidatures.errorDetail" @retry="reload" />

    <article v-else-if="candidatures.current" class="candidature-detail">
      <header class="detail-header">
        <div class="identity">
          <div class="avatar-lg">{{ initiales }}</div>
          <div>
            <h1>{{ candidatures.current.nom }}</h1>
            <p class="poste">{{ candidatures.current.poste }} · {{ candidatures.current.localisation }}</p>
          </div>
        </div>

        <div class="statut-control">
          <label for="statut-select">Statut</label>
          <div class="statut-control-row">
            <select
              id="statut-select"
              :value="candidatures.current.statut"
              :disabled="candidatures.updatingStatut"
              @change="handleStatutChange"
            >
              <option v-for="statut in reference.statuts" :key="statut.id" :value="statut.nom">
                {{ statut.nom }}
              </option>
            </select>
            <StatusBadge :statut="candidatures.current.statut" />
          </div>
        </div>
      </header>

      <ErrorBanner
        v-if="candidatures.actionError"
        :message="candidatures.actionError"
        @retry="candidatures.actionError = null"
      />

      <div class="detail-grid">
        <div class="info-card">
          <h2>Informations</h2>
          <dl class="info-list">
            <div><dt>Email</dt><dd><a :href="`mailto:${candidatures.current.email}`">{{ candidatures.current.email }}</a></dd></div>
            <div><dt>Téléphone</dt><dd>{{ candidatures.current.telephone }}</dd></div>
            <div><dt>Expérience</dt><dd>{{ candidatures.current.experience }}</dd></div>
            <div><dt>Disponibilité</dt><dd>{{ candidatures.current.disponibilite }}</dd></div>
            <div><dt>Salaire souhaité</dt><dd>{{ candidatures.current.salaireSouhaite.toLocaleString('fr-FR') }} €</dd></div>
            <div><dt>Candidature reçue le</dt><dd>{{ dateFormatee }}</dd></div>
            <div><dt>CV</dt><dd><a :href="candidatures.current.cv" target="_blank" rel="noopener">Voir le CV ↗</a></dd></div>
          </dl>
        </div>

        <div class="info-card">
          <h2>Compétences</h2>
          <ul class="competences-list">
            <li v-for="competence in candidatures.current.competences" :key="competence">{{ competence }}</li>
          </ul>

          <h2>Lettre de motivation</h2>
          <p class="lettre-motivation">{{ candidatures.current.lettreMotivation }}</p>
        </div>
      </div>

      <section class="comments-section">
        <h2>Commentaires <span class="count-pill">{{ candidatures.current.commentaires.length }}</span></h2>
        <CommentList :commentaires="candidatures.current.commentaires" />
        <CommentForm :submitting="candidatures.addingComment" @submit="handleAddComment" />
      </section>
    </article>
  </section>
</template>

<style scoped>
.detail-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.back-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  width: fit-content;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.candidature-detail {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.75rem;
}

.detail-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.25rem;
}

.identity {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-lg {
  width: 3.75rem;
  height: 3.75rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.3rem;
  color: white;
  background: var(--gradient-brand);
  flex-shrink: 0;
}

.detail-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.poste {
  margin: 0.2rem 0 0;
  color: var(--color-text-muted);
}

.statut-control {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

.statut-control label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  font-weight: 700;
}

.statut-control-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.statut-control select {
  padding: 0.5rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.info-card {
  padding: 1.25rem;
  border-radius: var(--radius-md);
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
}

.info-card h2 {
  margin: 0 0 0.9rem;
  font-size: 0.95rem;
}

.info-card h2 + h2 {
  margin-top: 1.25rem;
}

.info-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin: 0;
}

.info-list dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-muted);
  font-weight: 700;
}

.info-list dd {
  margin: 0.2rem 0 0;
}

.competences-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.competences-list li {
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 600;
}

.lettre-motivation {
  color: var(--color-text-muted);
  line-height: 1.65;
  margin: 0;
}

.comments-section {
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.comments-section h2 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.1rem;
  margin: 0 0 1rem;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.4rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
}

@media (min-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
