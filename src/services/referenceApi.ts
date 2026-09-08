import { http } from './http'
import type { Competence, Poste, Statut } from '../types'

export async function fetchStatuts(): Promise<Statut[]> {
  const response = await http.get<Statut[]>('/statuts')
  return [...response.data].sort((a, b) => a.ordre - b.ordre)
}

export async function fetchPostes(): Promise<Poste[]> {
  const response = await http.get<Poste[]>('/postes')
  return response.data
}

export async function fetchCompetences(): Promise<Competence[]> {
  const response = await http.get<Competence[]>('/competences')
  return response.data
}
