const BASE_URL = import.meta.env.VITE_BACKEND_URL
export function constructURL(endpoint: string) {
  if (endpoint.startsWith('/')) {
    return `${BASE_URL}${endpoint}`
  }

  return `${BASE_URL}/${endpoint}`
}
