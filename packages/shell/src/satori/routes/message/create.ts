import type { MessageCreatePayload as MessageCreatePayloadRich } from '../../types'
import type { MessageCreatePayload as MessageCreatePayloadEntity } from '../../types/satoriPayloadEntity'
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
  config,
  path,
  req,
  res,
  json,
}: RouteContext) {
  const payload = (await json()) as MessageCreatePayloadEntity

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

  const payloadRich: MessageCreatePayloadRich = {
    channel_id: payload.channel_id,
    content: cctx.chronocat.h.normalize(payload.content),
  }

  let method:
    | 'message.create'
    | 'chronocat.internal.message.create.forward'
    | 'chronocat.internal.message.create.forward.fake' = 'message.create'

  const forwards = cctx.chronocat.h
    .select(payloadRich.content, 'message')
    .filter((x) => x.attrs['forward'])

  if (forwards.length) {
    if (forwards.length > 1) {
      const err = `尚未支持单次请求发送多条「逐条转发」消息。来自 ${req.socket.remoteAddress}`

      cctx.chronocat.l.error(err, {
        code: 501,
      })

      res.writeHead(501)
      res.end(`501 not implemented\n${err}`)
      return
    }

    const [forward] = forwards

    if (forward!.attrs['id']) {
      const err = `尚未支持使用 ID 发送「逐条转发」消息。来自 ${req.socket.remoteAddress}`

      cctx.chronocat.l.error(err, {
        code: 501,
      })

      res.writeHead(501)
      res.end(`501 not implemented\n${err}`)
      return
    }

    if (!forward!.children)
      // 空转发消息
      return

    if (forward!.children.every((x) => x.attrs['id']))
      method = 'chronocat.internal.message.create.forward'
    else method = 'chronocat.internal.message.create.forward.fake'
  }

  return await cctx.chronocat.api[method](payloadRich, config)
}
