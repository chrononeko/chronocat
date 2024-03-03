import { analyzeMetafile, context } from 'esbuild'
import { join } from 'node:path'
import { cwd } from 'node:process'

const wd = cwd()

void (async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const { version } = require(join(wd, 'package.json'))

  const ctx = await context({
    entryPoints: [join(wd, 'src/index.ts')],
    write: true,
    outdir: 'lib',

    loader: {
      '.yml': 'text',
      '.html': 'text',
      '.txt': 'text',
    },

    platform: 'node',
    format: 'cjs',
    tsconfig: join(wd, 'tsconfig.json'),

    define: {
      __DEFINE_CHRONO_VERSION__: `'${version}'`,
    },
    external: ['electron'],

    bundle: true,
    minify: true,
    sourcemap: false,

    metafile: true,
    color: true,
  })

  console.log(await analyzeMetafile((await ctx.rebuild()).metafile))
  await ctx.dispose()
})()
