import fetch from 'node-fetch'
import type { ChronocatSatoriWebHookConfig } from '../services/config/configEntity'
import type { ChronocatContext, SatoriDispatchMessage } from '../types'
import { buildSnCounter } from '../utils/token'

export const initSatoriWebHook = async (
  cctx: ChronocatContext,
  config: ChronocatSatoriWebHookConfig,
) => {
  // 预处理 self_url
  if (!config.self_url || config.self_url === 'https://chronocat.vercel.app')
    config.self_url = `http://127.0.0.1:5500`
  if (config.self_url.endsWith('/'))
    config.self_url = config.self_url.slice(0, config.self_url.length - 1)

  const getSn = buildSnCounter()

  const dispatcher = (message: SatoriDispatchMessage) => {
    void (async () => {
      const uin = (await cctx.chronocat.getAuthData()).uin

      await message.toSatori(cctx, config).then((events) =>
        events.forEach((data) => {
          const body = {
            ...data,
            sn: getSn(),
            platform: cctx.chronocat.platform,
            self_id: uin,
          }

          const headers: HeadersInit = {}
          if (config.token) headers['Authorization'] = `Bearer ${config.token}`

          void fetch(config.url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          })
        }),
      )
    })()
  }

  return {
    dispatcher,
  }
}
