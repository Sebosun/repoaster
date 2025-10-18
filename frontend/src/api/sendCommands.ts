import { constructURL } from '@/api/helpers'

export function repostYtdlp(link: string, channels: string[]) {
  const endpoint = constructURL('/ytdlp')
  const payload = JSON.stringify({ link, channels })

  return fetch(`${endpoint}/ytdlp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  })
}

export function repostFile(file: FormData) {
  const endpoint = constructURL('/upload')
  return fetch(endpoint, {
    method: 'POST',
    body: file
  })
}

export function repostMessage(message: string, channels: string[]) {
  const endpoint = constructURL('/message')
  const payload = JSON.stringify({ message, channels })

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  })
}
