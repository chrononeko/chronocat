import type { MessageCreatePayload } from '../../types'
import type { RouteContext } from '../types'

export const messageCreate = async (rctx: RouteContext) => {
  let useForm = false
  const contentType = rctx.req.headers['content-type']
  if (contentType) {
    if (contentType.startsWith('application/x-www-form-urlencoded'))
      useForm = true
    if (contentType.startsWith('multipart/form-data')) useForm = true
  }

  if (useForm) return messageCreateUsingForm(rctx)
  else return messageCreateUsingJson(rctx)
}

async function messageCreateUsingForm({ cctx, path, req, res }: RouteContext) {
  cctx.chronocat.l.error(
    `${path} 失败，来自 ${req.socket.remoteAddress}。Form 请求尚未实现。`,
    {
      code: 501,
    },
  )

  res.writeHead(501)
  res.end('501 not implemented')

  return
}

async function messageCreateUsingJson({
  cctx,
  path,
  req,
  res,
  json,
}: RouteContext) {
  const payload = (await json()) as MessageCreatePayload

  const validateResult = await cctx.chronocat.validate('MessageCreatePayload')(
    payload,
  )

  if (validateResult) {
    const err = `解析 ${path} 请求时出现问题，来自 ${req.socket.remoteAddress}。${validateResult}`

    cctx.chronocat.l.error(err, {
      code: 400,
    })

    res.writeHead(400)
    res.end(`400 bad request\n${err}`)
    return
  }

  try {
    return await cctx.chronocat.api['message.create'](payload)
  } catch (e) {
    cctx.chronocat.l.error(
      new Error(`${path} 失败，来自 ${req.socket.remoteAddress}`, {
        cause: e,
      }),
      {
        code: 500,
      },
    )

    res.writeHead(500)
    res.end(`500 internal server error\n${e as string}`)

    return
  }
}
