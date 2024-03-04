import type { RouteContext } from './types'

export const notImplemented = async ({
  cctx,
  path,
  req,
  res,
}: RouteContext) => {
  cctx.chronocat.l.warn(
    `API ${path} 尚不可用（QQ 未支持该功能），来自 ${req.socket.remoteAddress}`,
    { code: 2148 },
  )

  res.writeHead(501)
  res.end('501 not implemented')
}
