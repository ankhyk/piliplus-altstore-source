import { generateSource } from './generator'
import type { Source } from './types'

const writeSource = async (outputPath: string, source: Source) => {
  await Bun.write(outputPath, JSON.stringify(source, null, 2))
  console.log(`成功生成 ${outputPath}`)
  console.log(`文件已保存到: ${outputPath}`)
  console.log(`包含 ${source.apps.length} 个版本`)
}

console.log('正在生成 PiliPlus AltStore source...')

const source = await generateSource(3)
await writeSource('generated/apps.json', source)

const singleSource: Source = { ...source, apps: source.apps.slice(0, 1) }
await writeSource('generated/app.json', singleSource)

const latestVersion = source.apps[0]?.versions[0]
if (!latestVersion) {
  console.log('\n未生成可用版本，请检查上面的警告日志。')
} else {
  console.log(`\n最新版本: ${latestVersion.version}`)
  console.log(`发布时间: ${latestVersion.date}`)
  console.log(`下载链接: ${latestVersion.downloadURL}`)
}
