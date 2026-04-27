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

export const generateSource = async (): Promise<Source> => {
  const releases = await fetchReleases()
  const latest3Releases = releases.slice(0, 3)
  if (!latest3Releases) {
    throw new Error('未找到任何版本')
  }

  const allVersionResults: Array<SourceVersion | null> = new Array(5).fill(null)

  const tasks = new Listr(
    latest3Releases.map((release, index) => ({
      title: `处理 ${release.tag_name}`,
      task: async () => {
        const sourceVersion = await updateToSourceVersion(release)

        allVersionResults[index] = sourceVersion
      },
    })),
    {
      concurrent: 5,
      exitOnError: false,
    }
  )

  await tasks.run()

  const allVersions = allVersionResults.filter(
    (version): version is SourceVersion => version !== null
  )

  if (allVersionResults.length !== allVersions.length) {
    const filteredCount = allVersionResults.length - allVersions.length
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
