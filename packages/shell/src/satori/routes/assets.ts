import { getType } from 'mime/lite'
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
    res.writeHead(404)
    res.end('404 asset not found')
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', getType(path)!)

  const readStream = createReadStream(path)
  await new Promise((resolve, reject) =>
    readStream.pipe(res).on('finish', resolve).on('error', reject),
  )
  res.end()
}
