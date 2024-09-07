import { analyzeMetafile, context } from 'esbuild'
import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { cwd } from 'node:process'

const wd = cwd()

void (async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const packageJson = require(join(wd, 'package.json')) as {
    name: string
    version: string
  }

  const name = packageJson.name.slice(11)

  const ctx = await context({
    entryPoints: [join(wd, 'src/index.ts')],
    write: true,
    outdir: 'lib',

    loader: {
      '.yml': 'text',
      '.html': 'text',
      '.txt': 'text',
      '.zip': 'binary',
    },

    platform: 'node',
    format: 'cjs',
    tsconfig: join(wd, 'tsconfig.json'),

    define: {
      __DEFINE_CHRONO_VERSION__: `'${packageJson.version}'`,
    },
    external: ['electron'],

    bundle: true,
    minify: true,
    sourcemap: false,

    metafile: true,
    color: true,
  })

  const result = await ctx.rebuild()

  const metafile = result.metafile
  const metaLog = await analyzeMetafile(metafile)
  const metaDir = resolve(__dirname, '../build/meta')
  const metaFilePath = join(metaDir, `${name}.meta.json`)

  await mkdir(metaDir, {
    recursive: true,
  })

  await writeFile(metaFilePath, JSON.stringify(metafile))

  if ('GITHUB_ACTIONS' in process.env) {
    // CI
    const summary = `## ${name} 的构建一览\n\n\`\`\`txt\n${metaLog}\n\n\`\`\`\n\n要获得旭日图或火焰图，下载 \`meta-xxx.zip\` 后上传至 [Bundle Size Analyzer](https://esbuild.github.io/analyze/)。\n\n`
    await appendFile(process.env['GITHUB_STEP_SUMMARY'] as string, summary)
  } else {
    // Local build
    console.log(metaLog)
  }

  await ctx.dispose()
})()
