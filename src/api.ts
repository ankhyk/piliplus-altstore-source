import type { Releases } from './types'

export const fetchReleases = async () => {
  const url = 'https://api.github.com/repos/bggRGjQaUbCoE/PiliPlus/releases'

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<Releases>
}
