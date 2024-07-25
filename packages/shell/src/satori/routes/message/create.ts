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
    | 'chronocat.internal.message.create2.normal'
    | 'chronocat.internal.message.create2.forward'
    | 'chronocat.internal.message.create2.forward.fake'
    | 'chronocat.internal.message.create2.poke'
    | 'chronocat.internal.message.create2.markdown' =
    'chronocat.internal.message.create2.normal'

  const forwards =
    // cctx.chronocat.h.select(payloadRich.content, 'message')
    payloadRich.content
      .filter((x) => x.type === 'message') // 直接子代而非所有子代
      .filter((x) => x.attrs['forward'])

  if (forwards.length) {
    if (forwards.length > 1) {
      const err = `尚未支持单次请求发送多条转发消息。来自 ${req.socket.remoteAddress}`

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

    // FIXME: 这里是否应该改成 if (!forward!.children?.length)
    if (!forward!.children)
      // 空转发消息
      return

    if (forward!.children.every((x) => x.attrs['id']))
      method = 'chronocat.internal.message.create2.forward'
    else method = 'chronocat.internal.message.create2.forward.fake'
  }

  const pokes = cctx.chronocat.h.select(
    payloadRich.content,
    `${cctx.chronocat.platform}:poke`,
  )
  if (pokes.length) {
    // TODO: 如果单条消息内除了 poke 还有其他元素，打印警告
    method = 'chronocat.internal.message.create2.poke'
  }

  const markdowns = cctx.chronocat.h.select(
    payloadRich.content,
    `${cctx.chronocat.platform}:markdown`,
  )
  if (markdowns.length) {
    // TODO: 如果单条消息内除了 markdown 还有其他元素，打印警告
    method = 'chronocat.internal.message.create2.markdown'
  }

  const result = await cctx.chronocat.api[method](payloadRich, config)

  // cctx.chronocat.emit(new MessageCreatedDispatchMessage(result))

  return result.map((x) => x.message).filter(Boolean)
}

// export class MessageCreatedDispatchMessage implements SatoriDispatchMessage {
//   constructor(private events: Event[]) {}
//   type = 'satori' as const

//   toSatori = async (
//     _ctx: ChronocatContext,
//     _config: O.Intersect<
//       ChronocatLogCurrentConfig,
//       ChronocatSatoriEventsConfig
//     >,
//   ) => this.events
// }
