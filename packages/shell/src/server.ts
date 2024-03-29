import { initSatoriServer } from './satori/server'
import { initSatoriWebHook } from './satori/webhook'
import type {
  ChronocatContext,
  DispatchMessage,
  SatoriDispatchMessage,
} from './types'

export const initServers = async (ctx: ChronocatContext) => {
  const l = ctx.chronocat.l

  l.debug('初始化服务')

  const config = await ctx.chronocat.getConfig()

  const dispatchers: ((message: SatoriDispatchMessage) => unknown)[] = []

  // 使用独立循环可避免已启动的服务继续运行
  for (const server of config.servers!)
    if (server.token === 'DEFINE_CHRONO_TOKEN')
      l.error('请先修改服务密码（token）', { code: 2135, throw: true })

  for (const server of config.servers!) {
    if (!server.enable) {
      l.debug('跳过不启用的服务')
      continue
    }

    switch (server.type) {
      case 'satori': {
        const { dispatcher } = await initSatoriServer(ctx, server)
        dispatchers.push(dispatcher)
        l.info(
          `satori: 启动 Satori 服务于 http://${server.listen}:${server.port}`,
        )
        break
      }

      case 'satori_webhook': {
        const { dispatcher } = await initSatoriWebHook(ctx, server)
        dispatchers.push(dispatcher)
        l.info(`satori: 启动 Satori WebHook 服务，目标 ${server.self_url}`)
        break
      }
    }
  }

  const emit = (message: DispatchMessage) => {
    if (message.type !== 'satori') return
    dispatchers.forEach((x) => x(message))
  }

  return {
    emit,
  }
}
