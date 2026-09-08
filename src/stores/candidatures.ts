import { defineStore } from 'pinia'
import {
  addCommentaire,
  fetchCandidatureById,
  fetchCandidatures,
  updateStatut,
} from '../services/candidaturesApi'
import { getErrorMessage } from '../services/http'
import { usePreferencesStore } from './preferences'
import type { Candidature } from '../types'

interface CandidaturesState {
  items: Candidature[]
  totalCount: number
  page: number
  loading: boolean
  error: string | null
  current: Candidature | null
  loadingDetail: boolean
  errorDetail: string | null
  updatingStatut: boolean
  addingComment: boolean
  actionError: string | null
  kanbanItems: Candidature[]
  kanbanLoading: boolean
  kanbanError: string | null
}

export const useCandidaturesStore = defineStore('candidatures', {
  state: (): CandidaturesState => ({
    items: [],
    totalCount: 0,
    page: 1,
    loading: false,
    error: null,
    current: null,
    loadingDetail: false,
    errorDetail: null,
    updatingStatut: false,
    addingComment: false,
    actionError: null,
    kanbanItems: [],
    kanbanLoading: false,
    kanbanError: null,
  }),
  getters: {
    totalPages: (state) => {
      const preferences = usePreferencesStore()
      return Math.max(1, Math.ceil(state.totalCount / preferences.limit))
    },
  },
  actions: {
    async loadList(page?: number) {
      const targetPage = page ?? this.page
      const preferences = usePreferencesStore()
      const { statut, poste, competence, q, dateDebut, dateFin, sort, order } = preferences.filters
      this.loading = true
      this.error = null
      this.page = targetPage

      try {
        if (competence) {
          // JSON Server ne sait pas filtrer un champ tableau (competences[]),
          // on récupère un lot large puis on filtre/pagine côté client.
          const { data } = await fetchCandidatures({
            statut,
            poste,
            q,
            dateDebut,
            dateFin,
            sort,
            order,
            page: 1,
            limit: 1000,
          })
          const filtered = data.filter((c) => c.competences.includes(competence))
          this.totalCount = filtered.length
          const start = (targetPage - 1) * preferences.limit
          this.items = filtered.slice(start, start + preferences.limit)
        } else {
          const { data, totalCount } = await fetchCandidatures({
            statut,
            poste,
            q,
            dateDebut,
            dateFin,
            sort,
            order,
            page: targetPage,
            limit: preferences.limit,
          })
          this.items = data
          this.totalCount = totalCount
        }
      } catch (err) {
        this.error = getErrorMessage(err)
      } finally {
        this.loading = false
      }
    },

    async loadKanban() {
      const preferences = usePreferencesStore()
      const { poste, competence, q, dateDebut, dateFin } = preferences.filters
      this.kanbanLoading = true
      this.kanbanError = null
      try {
        const { data } = await fetchCandidatures({
          poste,
          q,
          dateDebut,
          dateFin,
          page: 1,
          limit: 500,
        })
        this.kanbanItems = competence ? data.filter((c) => c.competences.includes(competence)) : data
      } catch (err) {
        this.kanbanError = getErrorMessage(err)
      } finally {
        this.kanbanLoading = false
      }
    },

    async moveCandidatureStatut(id: number, nouveauStatut: string) {
      const item = this.kanbanItems.find((c) => c.id === id)
      if (!item || item.statut === nouveauStatut) return
      const ancienStatut = item.statut
      item.statut = nouveauStatut
      this.kanbanError = null
      try {
        const updated = await updateStatut(id, nouveauStatut)
        item.statut = updated.statut
        const listItem = this.items.find((c) => c.id === id)
        if (listItem) listItem.statut = updated.statut
        if (this.current?.id === id) this.current.statut = updated.statut
      } catch (err) {
        item.statut = ancienStatut
        this.kanbanError = getErrorMessage(err)
      }
    },

    async loadDetail(id: number) {
      this.loadingDetail = true
      this.errorDetail = null
      this.current = null
      try {
        this.current = await fetchCandidatureById(id)
      } catch (err) {
        this.errorDetail = getErrorMessage(err)
      } finally {
        this.loadingDetail = false
      }
    },

    async changeStatut(nouveauStatut: string) {
      if (!this.current) return
      const ancienStatut = this.current.statut
      this.current.statut = nouveauStatut
      this.updatingStatut = true
      this.actionError = null
      try {
        const updated = await updateStatut(this.current.id, nouveauStatut)
        this.current.statut = updated.statut
        const itemInList = this.items.find((c) => c.id === this.current?.id)
        if (itemInList) itemInList.statut = updated.statut
      } catch (err) {
        this.current.statut = ancienStatut
        this.actionError = getErrorMessage(err)
      } finally {
        this.updatingStatut = false
      }
    },

    async addComment(auteur: string, contenu: string) {
      if (!this.current) return
      const previousComments = this.current.commentaires
      const optimisticComment = {
        id: Date.now(),
        auteur,
        date: new Date().toISOString(),
        contenu,
      }
      this.current.commentaires = [...previousComments, optimisticComment]
      this.addingComment = true
      this.actionError = null
      try {
        const updated = await addCommentaire(this.current.id, previousComments, auteur, contenu)
        this.current.commentaires = updated.commentaires
      } catch (err) {
        this.current.commentaires = previousComments
        this.actionError = getErrorMessage(err)
      } finally {
        this.addingComment = false
      }
    },
  },
})
