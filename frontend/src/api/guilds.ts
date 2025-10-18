import { constructURL } from '@/api/helpers'

async function getGuildFiles() {
  const endpoint = constructURL('/channels')

  const channels = await fetch(endpoint, {
    method: 'GET'
  })

  return channels
}

export { getGuildFiles }
