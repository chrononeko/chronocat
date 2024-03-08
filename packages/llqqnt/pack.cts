import { cp, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

void (async () => {
  const distPath = resolve(
    __dirname,
    '../../build/dist/llqqnt/LiteLoaderQQNT-Plugin-Chronocat',
  )
  const srcPath = join(distPath, 'src')

  await mkdir(srcPath, { recursive: true })
  await cp(join(__dirname, 'lib/index.js'), join(srcPath, 'main.js'))
  await cp(join(__dirname, 'manifest.json'), join(distPath, 'manifest.json'))
  await cp(
    resolve(__dirname, '../docs/static/chronocat.png'),
    join(distPath, 'chronocat.png'),
  )
})()
