import h from '@satorijs/element'
import { initServers } from './server'
import { api } from './services/api'
import { getAuthData } from './services/authData'
import { baseDir } from './services/baseDir'
import { getConfig } from './services/config'
import type { ChronocatLogCurrentConfig } from './services/config/configEntity'
import { emitter } from './services/emitter'
import { l } from './services/logger'
import { getSelfProfile, setSelfProfile } from './services/selfProfile'
import { uix } from './services/uix'
import { validate } from './services/validate'
import type { ChronocatContext, Engine } from './types'
import { PLATFORM } from './utils/consts'
import { exists } from './utils/fs'
import { sleep, timeout } from './utils/time'
import { bgGrey, cyan, white } from './utils/colors'
import { STARTUP_TEXT } from './utils/startup'

export * from './satori/types'
export * from './services/config/configEntity'
export * from './types'


export const chronocat = async () => {
  l.write(STARTUP_TEXT)

  let ready: () => void
  const readyPromise = new Promise<void>((res) => {
    ready = res
  })

  const ctx: ChronocatContext = {
    chronocat: {
      api,
      baseDir,
      emit: emitter.emit,
      exists,
      getAuthData,
      getConfig,
      getSelfProfile,
      h,
      l,
      platform: PLATFORM,
      sleep,
      timeout,
      uix,
      validate,
      whenReady: () => readyPromise,
    },
  }

  emitter.register(setSelfProfile)

  // getConfig() 包含用户配置，因此会先等待登录
  // 这是首个等待登录的位置
  // 所有在登录前就需要启动的服务均应在此之前
  l.debug('等待登录')
  const config = await getConfig()
  if (!config.enable) {
    l.info('根据配置文件要求，Chronocat 不会启用。')
    return
  }

  const log: ChronocatLogCurrentConfig = config.log!
  // 预处理 self_url
  if (!log.self_url || log.self_url === 'https://chronocat.vercel.app')
    log.self_url = `http://127.0.0.1:5500`
  if (log.self_url.endsWith('/'))
    log.self_url = log.self_url.slice(0, log.self_url.length - 1)

  // Log satori message
  emitter.register(async (m) => {
    if (m.type !== 'satori') return
      ; (await m.toSatori(ctx, log)).forEach((e) => l.parse(e))
  })

  emitter.register((await initServers(ctx)).emit)

  l.info('中身はあんまりないよ～ (v0.x)', { code: 560 })

  ready!()

  const outerContext = {
    load: (x: Engine) => {
      l.info(`加载引擎 ${cyan(x.name)} ${bgGrey(white(`v${x.version}`))}`)
      try {
        x.apply(ctx)
      } catch (e) {
        l.error(`加载引擎 ${x.name} 时出现问题。`, { code: 2155, throw: true })
      }
    },
  }

  // 将 outerContext 挂载至 process.version
  if (!process || !process.version) {
    l.warn('process.version 不存在，无法挂载 outerContext，一些 Engine 可能加载失败。')
  } else {
    // 如何通过 process.version 获取 outerContext：
    // ```ts
    // process.version = '__chronocat__'
    // const outerContext = process.version
    // ```

    const origVersion = process.version

    let signalHack = false
    // @ts-ignore
    process.__defineSetter__('version', (x) => {
      if (x === '__chronocat__')
        signalHack = true
    })

    // @ts-ignore
    process.__defineGetter__('version', () => {
      if (signalHack) {
        signalHack = false
        return outerContext
      }
      return origVersion
    })
  }

  return outerContext
}
