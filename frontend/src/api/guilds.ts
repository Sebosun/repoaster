export async function getGuildFiles() {
  const baseURL = 'http://localhost:3000'

  const channels = await fetch(`${baseURL}/channels`, {
    method: 'GET'
  })

  return channels
}
