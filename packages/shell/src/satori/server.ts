import { Buffer } from 'node:buffer'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createServer } from 'node:http'
import type { WebSocket } from 'ws'
import { WebSocketServer } from 'ws'
import satoriHtml from '../../static/satori.html'
import type { ChronocatSatoriServerConfig } from '../services/config/configEntity'
import type { ChronocatContext, SatoriDispatchMessage } from '../types'
import { ADAPTER, PLATFORM } from '../utils/consts'
import { timeout } from '../utils/time'
import { buildSnCounter } from '../utils/token'
import type { Routes } from './routes'
import { routes } from './routes'
import { assets } from './routes/assets'
import type { RouteContext } from './routes/types'
import type { Login, WebSocketIncomingMessage } from './types'
import { LoginStatus, Op } from './types'

declare const __DEFINE_CHRONO_VERSION__: string

const prefix = '/v1/'
const poweredBy = `Chronocat/${__DEFINE_CHRONO_VERSION__}`
const satoriHtmlBuffer = Buffer.from(satoriHtml)

export const initSatoriServer = async (
  cctx: ChronocatContext,
  config: ChronocatSatoriServerConfig,
) => {
  const l = cctx.chronocat.l

  // 预处理 self_url
  if (!config.self_url || config.self_url === 'https://chronocat.vercel.app')
    config.self_url = `http://127.0.0.1:${config.port}`
  if (config.self_url.endsWith('/'))
    config.self_url = config.self_url.slice(0, config.self_url.length - 1)

  const authorizedClients: WebSocket[] = []

  const getEventSn = buildSnCounter()
  const getLoginSn = buildSnCounter()

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = createServer(async (req, res) => {
    if (!req.url) {
      l.warn(
        `satori: server: 非法请求: URL 非法，来自 ${req.socket.remoteAddress}`,
        { code: 2135 },
      )
      res.writeHead(400)
      res.end('400 bad request')
      return
    }

    const url = new URL(req.url, 'http://dummy')

    res.setHeader('Server', poweredBy)
    res.setHeader('X-Powered-By', poweredBy)

    if (url.pathname === '/') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'no-cache',
        'Content-Length': satoriHtmlBuffer.byteLength,
      })
      res.end(satoriHtmlBuffer)
    }

    if (!url.pathname.startsWith(prefix)) {
      l.warn(
        `satori: server: 404，请求 ${url.pathname}，来自 ${req.socket.remoteAddress}`,
        {
          code: 404,
        },
      )
      res.writeHead(404)
      res.end('404 not found')
      return
    }

    const path = url.pathname.slice(prefix.length)

    if (path.startsWith('assets/')) {
      if (req.method !== 'GET') {
        l.warn(
          `satori: server: 不支持 ${req.method} 请求资源，来自 ${req.socket.remoteAddress}`,
          { code: 405 },
        )
        res.writeHead(405)
        res.end('405 method not allowed')
        return
      }

      try {
        await assets({
          raw: path.slice('assets/'.length),
          ...buildRouteCtx(cctx, config, req, res, path),
        })

        if (!res.writableEnded) throw new Error()

        return
      } catch (e) {
        l.warn(
          new Error(`${path} 失败，来自 ${req.socket.remoteAddress}`, {
            cause: e,
          }),
          { code: 500 },
        )

        res.writeHead(500)
        res.end(`500 internal server error\n${e as string}`)

        return
      }
    }

    if (
      config.token &&
      !(
        req.headers.authorization?.slice(0, 7) === 'Bearer ' &&
        req.headers.authorization.slice(7) === config.token
      )
    ) {
      l.warn(`satori: server: 401，来自 ${req.socket.remoteAddress}`, {
        code: 401,
      })
      res.writeHead(401)
      res.end('401 unauthorized')
      return
    }

    const method = routes[path as Routes]

    if (!method) {
      l.warn(
        `satori: server: 404，请求 ${url.pathname}，来自 ${req.socket.remoteAddress}`,
        {
          code: 404,
        },
      )
      res.writeHead(404)
      res.end('404 not found')
      return
    }

    if (req.method !== 'POST') {
      l.warn(
        `satori: server: 不支持 ${req.method} 请求 API，来自 ${req.socket.remoteAddress}`,
        { code: 405 },
      )
      res.writeHead(405)
      res.end('405 method not allowed')
      return
    }

    try {
      const result = await method(buildRouteCtx(cctx, config, req, res, path))

      if (!res.writableEnded) {
        res.writeHead(200, {
          'Content-Type': 'application/json',
        })
        res.end(JSON.stringify(result))
      }

      return
    } catch (e) {
      l.warn(
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
  })

  const wsServer = new WebSocketServer({
    server,
    path: prefix + 'events',
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  wsServer.on('connection', async (ws, req) => {
    let authorized = !config.token

    const addToAuthorizedClients = () => {
      authorizedClients.push(ws)
      ws.on('close', () =>
        authorizedClients.splice(authorizedClients.indexOf(ws), 1),
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ws.on('message', async (raw) => {
      const message = JSON.parse(
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        raw.toString(),
      ) as WebSocketIncomingMessage

      switch (message.op) {
        case Op.Ping: {
          ws.send(
            JSON.stringify({
              op: Op.Pong,
            }),
          )
          return
        }

        case Op.Identify: {
          if (authorized) {
            l.warn(
              `satori: server: 多次发送了 IDENTIFY 信令，来自 ${req.socket.remoteAddress}`,
              {
                code: 2132,
              },
            )
            return
          }

          if (config.token && message.body?.token !== config.token) {
            ws.close(3000, 'Unauthorized')
            return
          }

          authorized = true
          addToAuthorizedClients()

          const uin = (await cctx.chronocat.getAuthData()).uin

          const login: Login = {
            sn: getLoginSn(),
            platform: PLATFORM,
            user: {
              id: uin,
              name: cctx.chronocat.getSelfProfile().nick,
              avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${uin}&spec=640`,
              is_bot: false,
            },
            status: LoginStatus.ONLINE,
            adapter: ADAPTER,
            features: [
              'channel.get',
              'channel.list',
              'channel.create',
              'channel.update',
              'channel.delete',
              'unsafe.channel.mute',
              'unsafe.channel.member.mute',
              'user.channel.create',
              'guild.get',
              'guild.list',
              'guild.approve',
              'unsafe.guild.remove',
              'guild.member.get',
              'guild.member.list',
              'guild.member.kick',
              'guild.member.approve',
              'guild.member.mute',
              'guild.member.role.set',
              'guild.member.role.unset',
              'chronocat.guild.member.title.set',
              'guild.role.list',
              'guild.role.create',
              'guild.role.update',
              'guild.role.delete',
              'login.get',
              'message.create',
              'message.get',
              'message.delete',
              'message.update',
              'message.list',
              'reaction.create',
              'reaction.delete',
              'reaction.clear',
              'reaction.list',
              'user.get',
              'friend.list',
              'friend.approve',
              'unsafe.friend.remove',
              'chronocat.putongdejiekou1',
              'guild.plain',
            ],
          }

          ws.send(
            JSON.stringify({
              op: Op.Ready,
              body: {
                logins: [login],
                proxy_urls: [],
              },
            }),
          )

          l.info(`satori: 接受连接，来自 ${req.socket.remoteAddress}`)

          return
        }

        case Op.Meta: {
          // TODO: implement this
          return
        }

        default: {
          l.warn(
            `satori: server: 未知的 opCode：${
              (
                message as {
                  op: number
                }
              ).op
            }，来自 ${req.socket.remoteAddress}`,
            { code: 2133 },
          )
          return
        }
      }
    })

    if (config.token)
      setTimeout(() => {
        if (!authorized) ws.close(3000, 'Unauthorized')
      }, timeout)
    else addToAuthorizedClients()
  })

  const dispatcher = async (message: SatoriDispatchMessage) => {
    const uin = (await cctx.chronocat.getAuthData()).uin

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    authorizedClients.forEach(async (ws) => {
      await message.toSatori(cctx, config).then((events) =>
        events.forEach((body) =>
          ws.send(
            JSON.stringify({
              op: Op.Event,
              body: {
                ...body,
                sn: getEventSn(),
                platform: cctx.chronocat.platform,
                self_id: uin,
              },
            }),
          ),
        ),
      )
    })
  }

  server.listen(config.port, config.listen)

  return {
    dispatcher,
  }
}

function buildRouteCtx(
  cctx: ChronocatContext,
  config: ChronocatSatoriServerConfig,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  path: string,
): RouteContext {
  const buffer = () => {
    const chunks: Uint8Array[] = []
    return new Promise<Buffer>((resolve, reject) => {
      req.on('data', (chunk) => {
        chunks.push(chunk)
      })
      req.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      req.on('error', () => {
        reject()
      })
    })
  }

  const string = () => buffer().then((b) => b.toString('utf-8'))

  const json = () => string().then((s) => (s ? (JSON.parse(s) as unknown) : {}))

  return {
    cctx,
    config,
    req,
    res,
    path,
    buffer,
    string,
    json,
  }
}
