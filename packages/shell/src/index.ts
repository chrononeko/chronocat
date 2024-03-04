import styles from 'ansi-styles'
import { mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { initServers } from './server'
import { api } from './services/api'
import { getAuthData } from './services/authData'
import { baseDir } from './services/baseDir'
import { getConfig } from './services/config'
import { l } from './services/logger'
import { validate } from './services/validate'
import type { ChronocatContext, DispatchMessage, Engine } from './types'

export const chronocat = async () => {
  let emitImpl = (_: DispatchMessage) => {}

  let ready: () => void
  const readyPromise = new Promise<void>((res) => {
    ready = res
  })

  const ctx: ChronocatContext = {
    chronocat: {
      api,
      baseDir,
      emit: (message: DispatchMessage) => emitImpl(message),
      getAuthData,
      getConfig,
      l,
      validate,
      whenReady: () => readyPromise,
    },
  }

  const enginesPath = join(baseDir, 'engines')

  mkdirSync(enginesPath, {
    recursive: true,
  })

  const engines = readdirSync(enginesPath).map((filename) => {
    let name = filename
    if (name.endsWith('.jsc')) name = name.slice(0, name.length - 4)
    if (name.endsWith('.js')) name = name.slice(0, name.length - 3)

    return {
      name,
      path: join(enginesPath, filename),
    }
  })

  for (const engine of engines) {
    try {
      l.info(
        `加载引擎：${styles.green.open}${engine.name}${styles.green.close}`,
      )

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ;(require(engine.path) as Engine).apply(ctx)
    } catch (e) {
      setTimeout(() => process.exit(1), 2000)
      l.error(
        new Error(`加载引擎 ${engine.name} 失败`, {
          cause: e,
        }),
        {
          code: 2155,
          throw: true,
        },
      )
    }
  }

  // getConfig() 包含用户配置，因此会先等待登录
  // 这是首个等待登录的位置
  // 所有在登录前就需要启动的服务均应在此之前
  l.debug('等待登录')
  const config = await getConfig()
  if (!config.enable) {
    l.info('根据配置文件要求，退出 Chronocat')
    return
  }

  emitImpl = (await initServers()).emit

  l.info('中身はあんまりないよ～ (v0.x)', { code: 560 })

  ready!()
}
