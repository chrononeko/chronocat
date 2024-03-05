import { cp, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

void Promise.all(
  ['engine-chronocat-api', 'engine-chronocat-event'].map(async (x) => {
    const srcPath = resolve(__dirname, `../packages/${x}/lib/index.js`)

    const distPath = resolve(__dirname, `../build/dist/${x}`)

    await mkdir(distPath, {
      recursive: true,
    })

    await cp(srcPath, join(distPath, `${x}.js`))
  }),
)
