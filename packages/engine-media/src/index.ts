import type { ChronocatContext } from '@chronocat/shell'
import AdmZip from 'adm-zip'
import { execFile } from 'node:child_process'
import { BinaryLike, createHash } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { arch, platform } from 'node:process'
import ntsilkZip from '../../../build/caches/ntsilk.zip'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-media'
export const version = __DEFINE_CHRONO_VERSION__

const durationRegex = /^ *Duration: (\d+):(\d+):(\d+).(\d+),/m

export const apply = async (ctx: ChronocatContext) => {
  let ntsilkPath: string

  try {
    ntsilkPath = await load(ctx)
  } catch (cause) {
    ctx.chronocat.l.warn(
      new Error('engine-crychiccat: 加载失败', {
        cause,
      }),
      {
        code: 2162,
      },
    )

    return
  }

  const register = ctx.chronocat.api.register(name)

  register(
    'chronocat.internal.media.ntsilk.encode',
    (payload) =>
      new Promise((res, rej) => {
        execFile(
          ntsilkPath,
          ['-y', '-i', payload.srcPath, '-f', 'ntsilk_s16le', payload.dstPath],
          {},
          (err, _stdout, stderr) => {
            if (err) {
              // 清理可能存在的已转码文件
              ctx.chronocat.exists(payload.dstPath).then((x) => {
                if (x) void unlink(payload.dstPath)
              })

              rej(err)
              return
            }

            const capture = durationRegex.exec(stderr)
            const hrs = Number(capture?.[1]) || 0
            const min = Number(capture?.[2]) || 0
            const sec = Number(capture?.[3]) || 0
            const ms = Number(capture?.[4]) || 0

            res({
              duration: 360000 * hrs + 6000 * min + 100 * sec + ms,
              waveAmplitudes: undefined,
            })
          },
        )
      }),
  )
}

const suffix = platform === 'win32' ? '.exe' : ''
const entryName = `ntsilk-${platform}-${arch}${suffix}`

const load = async (ctx: ChronocatContext) => {
  const data = await new Promise<Buffer>((res, rej) => {
    new AdmZip(Buffer.from(ntsilkZip)).readFileAsync(entryName, (data, err) =>
      err ? rej(new Error(`读取文件失败`)) : res(data!),
    )
  })

  const hash = getHash(data)

  const dir = join(homedir(), `.chronocat/tmp/native`)

  await mkdir(dir, {
    recursive: true,
  })

  const path = join(dir, `${hash}${suffix}`)
  if (!(await ctx.chronocat.exists(path))) await writeFile(path, data)

  return path
}

const getHash = (data: BinaryLike) => {
  const hash = createHash('sha256')
  hash.update(data)
  return hash.digest('hex')
}
