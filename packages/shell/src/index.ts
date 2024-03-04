import styles from 'ansi-styles'
import { mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { initServers } from './server'
import { api } from './services/api'
import { getAuthData } from './services/authData'
import { baseDir } from './services/baseDir'
import { getConfig } from './services/config'
import { emitter } from './services/emitter'
import { l } from './services/logger'
import { getSelfProfile, setSelfProfile } from './services/selfProfile'
import { validate } from './services/validate'
import type { ChronocatContext, Engine } from './types'
import { PLATFORM } from './utils/consts'

declare const __DEFINE_CHRONO_VERSION__: string

export const chronocat = async () => {
  l.info(`Chronocat v${__DEFINE_CHRONO_VERSION__}`)

  let ready: () => void
  const readyPromise = new Promise<void>((res) => {
    ready = res
  })

  const ctx: ChronocatContext = {
    chronocat: {
      api,
      baseDir,
      emit: emitter.emit,
      getAuthData,
      getConfig,
      getSelfProfile,
      l,
      platform: PLATFORM,
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
    let type = 'js'
    if (name.endsWith('.jsc')) {
      name = name.slice(0, name.length - 4)
      type = 'jsc'
    }
    if (name.endsWith('.js')) name = name.slice(0, name.length - 3)

    return {
      name,
      filename,
      type,
      path: join(enginesPath, filename),
    }
  })

  for (const engineInfo of engines) {
    try {
      l.debug(
        `加载引擎：${styles.green.open}${engineInfo.filename}${styles.green.close}`,
      )

      if (engineInfo.type === 'jsc') require('bytenode')

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const engine = require(engineInfo.path) as unknown as Engine
      l.info(
        `使用引擎 ${engine.name} v${engine.version}${styles.grey.open}，来自 ${engineInfo.filename}${styles.grey.close}`,
      )
      engine.apply(ctx)
    } catch (e) {
      setTimeout(() => process.exit(1), 2000)
      l.error(
        new Error(`加载引擎 ${engineInfo.filename} 失败`, {
          cause: e,
        }),
        {
          code: 2155,
          throw: true,
        },
      )
    }
  }

  emitter.register(setSelfProfile)

  // getConfig() 包含用户配置，因此会先等待登录
  // 这是首个等待登录的位置
  // 所有在登录前就需要启动的服务均应在此之前
  l.debug('等待登录')
  const config = await getConfig()
  if (!config.enable) {
    l.info('根据配置文件要求，退出 Chronocat')
    return
  }

  emitter.register((await initServers(ctx)).emit)

  l.info('中身はあんまりないよ～ (v0.x)', { code: 560 })

  ready!()
}
