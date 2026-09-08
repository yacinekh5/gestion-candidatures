export interface Commentaire {
  id: number
  auteur: string
  date: string
  contenu: string
}

export interface Candidature {
  id: number
  nom: string
  poste: string
  statut: string
  competences: string[]
  experience: string
  dateCandidature: string
  email: string
  telephone: string
  cv: string
  lettreMotivation: string
  salaireSouhaite: number
  disponibilite: string
  localisation: string
  commentaires: Commentaire[]
}

export interface Statut {
  id: number
  nom: string
  couleur: string
  ordre: number
}

export interface Poste {
  id: number
  titre: string
  description: string
  competencesRequises: string[]
}

export interface Competence {
  id: number
  nom: string
  categorie: string
}

export interface CandidaturesFilters {
  statut: string
  poste: string
  competence: string
  q: string
  dateDebut: string
  dateFin: string
  sort: 'dateCandidature' | 'nom' | 'salaireSouhaite'
  order: 'asc' | 'desc'
}

export interface CandidaturesQueryResult {
  data: Candidature[]
  totalCount: number
}
