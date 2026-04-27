export interface Reactions {
  url: string
  total_count: number
  '+1': number
  '-1': number
  laugh: number
  hooray: number
  confused: number
  heart: number
  rocket: number
  eyes: number
}

export interface Author {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  user_view_type: string
  site_admin: boolean
}

export interface Asset {
  url: string
  id: number
  node_id: string
  name: string
  label: string
  uploader: Author
  content_type: string
  state: string
  size: number
  digest: string
  download_count: number
  created_at: string
  updated_at: string
  browser_download_url: string
}

export interface Release {
  url: string
  assets_url: string
  upload_url: string
  html_url: string
  id: number
  author: Author
  node_id: string
  tag_name: string
  target_commitish: string
  name: string
  draft: boolean
  immutable: boolean
  prerelease: boolean
  created_at: string
  updated_at: string
  published_at: string
  assets: Asset[]
  tarball_url: string
  zipball_url: string
  body: string
  reactions: Reactions
  mentions_count: number
}

export type Releases = Release[]

export interface Source {
  name: string
  subtitle?: string
  description?: string
  iconURL?: string
  headerURL?: string
  website?: string
  patreonURL?: string
  tintColor?: string
  featuredApps?: string[]
  apps: App[]
  news: News[]
}

export interface SourceVersion {
  version: string
  buildVersion: string
  date: string
  size: number
  downloadURL: string
  subtitle?: string
  localizedDescription: string
  minOSVersion?: string
  maxOSVersion?: string
}

export interface App {
  name: string
  bundleIdentifier: string
  marketplaceID?: string
  developerName: string
  subtitle?: string
  localizedDescription: string
  iconURL: string
  tintColor: string
  category?:
    | 'developer'
    | 'entertainment'
    | 'games'
    | 'lifestyle'
    | 'other'
    | 'photo-video'
    | 'social'
    | 'utilities'
  screenshots: Array<imageWithSize | string> | ScreenshotsClass
  versions: SourceVersion[]
  appPermissions: {
    entitlements: string[]
    privacy: Record<string, string>
  }
  patreon?: {
    pledge: number
    currency: string
    benefit: string
    tiers: string[]
  }
}

interface imageWithSize {
  imageURL: string
  width?: number
  height?: number
}

interface ScreenshotsClass {
  iphone: (imageWithSize | string)[]
  /**
   * All iPad screenshots must provide an explicit `width` and `height`
   *
   * https://faq.altstore.io/developers/make-a-source#width-number
   * https://faq.altstore.io/developers/make-a-source#height-number
   */
  ipad?: Required<imageWithSize>[]
}
interface News {
  title: string
  identifier: string
  caption: string
  date: string
  tintColor: string
  imageURL: string
  notify: boolean
  url?: string
  appID?: string
}
