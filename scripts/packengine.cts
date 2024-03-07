import { cp, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

void Promise.all(
  ['engine-chronocat-api', 'engine-chronocat-event'].map(async (x) => {
    const srcPath = resolve(__dirname, `../packages/${x}/lib/index.js`)

    const distDir = resolve(__dirname, `../build/dist/${x}`)

    await mkdir(distDir, {
      recursive: true,
    })

    const filename = `${x.slice(7)}.engine.js`

    const distPath = join(distDir, filename)

    await cp(srcPath, distPath)

    await cp(
      distPath,
      resolve(__dirname, `../build/dist/llqqntv0/src/${filename}`),
    )
    await cp(
      distPath,
      resolve(__dirname, `../build/dist/llqqntv1/src/${filename}`),
    )
  }),
)
