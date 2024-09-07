import { createReadStream } from 'node:fs'
import type { RouteContext } from './types'

export const assets = async ({
  cctx,
  raw,
  res,
}: RouteContext & {
  raw: string
}) => {
  let path: string | undefined = undefined

  try {
    path = await cctx.chronocat.api['chronocat.internal.assets.get'](raw)
  } catch (e) {
    cctx.chronocat.l.error(
      new Error('获取资源失败', {
        cause: e,
      }),
      {
        code: 2158,
      },
    )

    res.writeHead(500)
    res.end(`500 internal server error\n${e as string}`)

    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', cctx.chronocat.mime.getType(path)!)

  const readStream = createReadStream(path)
  await new Promise((resolve, reject) =>
    readStream.pipe(res).on('finish', resolve).on('error', reject),
  )
  res.end()
}
