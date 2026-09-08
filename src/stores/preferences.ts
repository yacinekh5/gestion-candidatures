import { defineStore } from 'pinia'
import type { CandidaturesFilters } from '../types'

const STORAGE_KEY = 'seg-preferences'

export type ViewMode = 'liste' | 'kanban'

interface PreferencesState {
  filters: CandidaturesFilters
  limit: number
  darkMode: boolean
  auteurNom: string
  viewMode: ViewMode
}

function loadFromStorage(): Partial<PreferencesState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function defaultFilters(): CandidaturesFilters {
  return {
    statut: '',
    poste: '',
    competence: '',
    q: '',
    dateDebut: '',
    dateFin: '',
    sort: 'dateCandidature',
    order: 'desc',
  }
}

const DEFAULT_LIMIT = 10

export const usePreferencesStore = defineStore('preferences', {
  state: (): PreferencesState => {
    const stored = loadFromStorage()
    return {
      filters: { ...defaultFilters(), ...stored.filters },
      limit: stored.limit ?? DEFAULT_LIMIT,
      darkMode: stored.darkMode ?? false,
      auteurNom: stored.auteurNom ?? '',
      viewMode: stored.viewMode ?? 'liste',
    }
  },
  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          filters: this.filters,
          limit: this.limit,
          darkMode: this.darkMode,
          auteurNom: this.auteurNom,
          viewMode: this.viewMode,
        }),
      )
    },
    setFilters(filters: Partial<CandidaturesFilters>) {
      this.filters = { ...this.filters, ...filters }
      this.persist()
    },
    resetFilters() {
      this.filters = defaultFilters()
      this.limit = DEFAULT_LIMIT
      this.persist()
    },
    setLimit(limit: number) {
      this.limit = limit
      this.persist()
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.persist()
    },
    setAuteurNom(nom: string) {
      this.auteurNom = nom
      this.persist()
    },
    setViewMode(mode: ViewMode) {
      this.viewMode = mode
      this.persist()
    },
  },
})
