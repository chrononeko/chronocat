import { cp, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

void Promise.all(
  ['engine-chronocat-api', 'engine-chronocat-event', 'engine-media'].map(
    async (x) => {
      const upper = `${x[0]!.toUpperCase()}${x.slice(1, 7)}${x[7]!.toUpperCase()}${x.slice(8, 17)}${x[17]!.toUpperCase()}${x.slice(18)}`
      const distName = `LiteLoaderQQNT-Plugin-Chronocat-${upper}`

      const corePath = resolve(__dirname, `../packages/${x}/lib/index.js`)
      const coreName = `${x.slice(7)}.engine.js`

      const distPath = resolve(
        __dirname,
        `../build/dist/llqqnt-plugin-chronocat-${x}/${distName}`,
      )

      const srcPath = join(distPath, 'src')

      await mkdir(srcPath, {
        recursive: true,
      })

      await writeFile(
        join(srcPath, 'main.js'),
        `setTimeout(()=>{process.version='__chronocat__';process.version.load(require('./${coreName}'))},0)`,
      )

      await cp(corePath, join(srcPath, coreName))

      const { version, description } =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`../packages/${x}/package.json`) as {
          version: string
          description: string
        }

      const manifest = {
        manifest_version: 4,
        type: 'extension',
        name: `Chronocat Engine: ${x[7]!.toUpperCase()}${x.slice(8, 17)}${x[17]!.toUpperCase()}${x.slice(18)}`,
        slug: `chronocat-${x}`,
        description,
        version,
        thumbnail: './chronocat.png',
        authors: [
          {
            name: 'Team Chrononeko',
            link: 'https://github.com/chrononeko',
          },
        ],
        repository: {
          repo: `chrononeko/${distName}`,
          branch: 'master',
        },
        platform: ['win32', 'linux', 'darwin'],
        dependencies: [],
        injects: {
          main: './src/main.js',
        },
      }

      await writeFile(join(distPath, 'manifest.json'), JSON.stringify(manifest))

      await cp(
        resolve(__dirname, '../packages/docs/static/chronocat.png'),
        join(distPath, 'chronocat.png'),
      )
    },
  ),
)
