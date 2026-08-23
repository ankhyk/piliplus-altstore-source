import { Listr } from 'listr2'
import { fetchReleases } from './api'
import type { App, Source, SourceVersion } from './types'
import { updateToSourceVersion } from './utils'

const appTemplate: Omit<App, 'versions'> = {
  name: 'PiliPlus',
  bundleIdentifier: 'com.example.piliplus',
  developerName: 'bggRGjQaUbCoE',
  subtitle: '使用Flutter开发的BiliBili第三方客户端',
  localizedDescription: '使用Flutter开发的BiliBili第三方客户端',
  iconURL:
    'https://raw.githubusercontent.com/bggRGjQaUbCoE/PiliPlus/main/assets/images/logo/logo.png',
  tintColor: '#5cb67b',
  category: 'entertainment',
  screenshots: {
    iphone: [
      'https://raw.githubusercontent.com/bggRGjQaUbCoE/PiliPlus/main/assets/screenshots/510shots_so.png',
      'https://raw.githubusercontent.com/bggRGjQaUbCoE/PiliPlus/main/assets/screenshots/174shots_so.png',
      'https://raw.githubusercontent.com/bggRGjQaUbCoE/PiliPlus/main/assets/screenshots/850shots_so.png',
      'https://raw.githubusercontent.com/bggRGjQaUbCoE/PiliPlus/main/assets/screenshots/main_screen.png',
    ],
  },
  appPermissions: {
    entitlements: [],
    privacy: {},
  },
}

export const generateSource = async (versionCount: number): Promise<Source> => {
  if (!Number.isInteger(versionCount) || versionCount < 1) {
    throw new RangeError('版本数量必须是大于 0 的整数')
  }

  const releases = await fetchReleases()
  const latestReleases = releases.slice(0, versionCount)
  if (latestReleases.length === 0) {
    throw new Error('未找到任何版本')
  }

  const allVersionResults: Array<SourceVersion | null> = new Array(latestReleases.length).fill(null)

  const tasks = new Listr(
    latestReleases.map((release, index) => ({
      title: `处理 ${release.tag_name}`,
      task: async () => {
        const sourceVersion = await updateToSourceVersion(release)

        allVersionResults[index] = sourceVersion
      },
    })),
    {
      concurrent: Math.min(5, latestReleases.length),
      exitOnError: false,
    }
  )

  await tasks.run()

  const allVersions = allVersionResults.filter(
    (version): version is SourceVersion => version !== null
  )

  if (allVersions.length !== latestReleases.length) {
    const filteredCount = latestReleases.length - allVersions.length
    console.warn(`[warn] 过滤掉了 ${filteredCount} 个无法下载的版本`)
  }

  const apps: App[] = allVersions.map((version) => ({
    ...appTemplate,
    versions: [version],
  }))

  const source: Source = {
    name: 'PiliPlus Source',
    iconURL: appTemplate.iconURL,
    website: 'https://github.com/bggRGjQaUbCoE/PiliPlus',
    tintColor: appTemplate.tintColor,
    featuredApps: [appTemplate.bundleIdentifier],
    apps: [...apps],
    news: [],
  }

  return source
}
