import { defineStore } from 'pinia'
import { fetchCompetences, fetchPostes, fetchStatuts } from '../services/referenceApi'
import { getErrorMessage } from '../services/http'
import type { Competence, Poste, Statut } from '../types'

interface ReferenceState {
  statuts: Statut[]
  postes: Poste[]
  competences: Competence[]
  loaded: boolean
  loading: boolean
  error: string | null
}

export const useReferenceStore = defineStore('reference', {
  state: (): ReferenceState => ({
    statuts: [],
    postes: [],
    competences: [],
    loaded: false,
    loading: false,
    error: null,
  }),
  getters: {
    couleurStatut: (state) => (nomStatut: string) =>
      state.statuts.find((s) => s.nom === nomStatut)?.couleur ?? '#94a3b8',
  },
  actions: {
    async loadAll() {
      if (this.loaded || this.loading) return
      this.loading = true
      this.error = null
      try {
        const [statuts, postes, competences] = await Promise.all([
          fetchStatuts(),
          fetchPostes(),
          fetchCompetences(),
        ])
        this.statuts = statuts
        this.postes = postes
        this.competences = competences
        this.loaded = true
      } catch (err) {
        this.error = getErrorMessage(err)
      } finally {
        this.loading = false
      }
    },
  },
})
