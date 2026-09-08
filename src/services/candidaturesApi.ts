import { http } from './http'
import type { Candidature, CandidaturesFilters, CandidaturesQueryResult, Commentaire } from '../types'

interface FetchOptions extends Partial<CandidaturesFilters> {
  page: number
  limit: number
}

export async function fetchCandidatures(options: FetchOptions): Promise<CandidaturesQueryResult> {
  const params: Record<string, string | number> = {
    _page: options.page,
    _limit: options.limit,
  }
  if (options.statut) params.statut = options.statut
  if (options.poste) params.poste = options.poste
  if (options.q) params.q = options.q
  if (options.dateDebut) params.dateCandidature_gte = options.dateDebut
  if (options.dateFin) params.dateCandidature_lte = `${options.dateFin}T23:59:59.999`
  if (options.sort) {
    params._sort = options.sort
    params._order = options.order ?? 'desc'
  }

  const response = await http.get<Candidature[]>('/candidatures', { params })
  const totalCount = Number(response.headers['x-total-count'] ?? response.data.length)
  return { data: response.data, totalCount }
}

export async function fetchCandidatureById(id: number): Promise<Candidature> {
  const response = await http.get<Candidature>(`/candidatures/${id}`)
  return response.data
}

export async function updateStatut(id: number, statut: string): Promise<Candidature> {
  const response = await http.patch<Candidature>(`/candidatures/${id}`, { statut })
  return response.data
}

export async function addCommentaire(
  id: number,
  commentairesActuels: Commentaire[],
  auteur: string,
  contenu: string,
): Promise<Candidature> {
  const nouveauCommentaire: Commentaire = {
    id: Date.now(),
    auteur,
    date: new Date().toISOString(),
    contenu,
  }
  const commentaires = [...commentairesActuels, nouveauCommentaire]
  const response = await http.patch<Candidature>(`/candidatures/${id}`, { commentaires })
  return response.data
}
