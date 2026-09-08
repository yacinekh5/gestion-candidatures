import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  timeout: 8000,
})

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return "Le serveur met trop de temps à répondre (timeout)."
    }
    if (!error.response) {
      return "Impossible de contacter le serveur. Vérifiez que JSON Server est lancé (npm run api)."
    }
    if (error.response.status === 404) {
      return "Ressource introuvable."
    }
    if (error.response.status >= 500) {
      return "Erreur serveur, veuillez réessayer."
    }
  }
  return "Une erreur inattendue est survenue."
}
