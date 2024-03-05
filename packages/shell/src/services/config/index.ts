// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import { app } from 'electron'
import { load } from 'js-yaml'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { env } from 'node:process'
import defaultConfig from '../../../../docs/static/chronocat.yml'
import { exists } from '../../utils/fs'
import { generateToken } from '../../utils/token'
import { getAuthData } from '../authData'
import { baseDir } from '../baseDir'
import { l } from '../logger'
import { validate } from '../validate'
import type { ChronocatConfig, ChronocatCurrentConfig } from './configEntity'

let config: ChronocatCurrentConfig | undefined = undefined

const task = (async () => {
  const configDir = join(baseDir, 'config')
  const configPath = join(configDir, 'chronocat.yml')

  if (!(await exists(configPath))) {
    // 配置文件不存在，生成新配置
    const newConfig = defaultConfig.replaceAll(
      'DEFINE_CHRONO_TOKEN',
      `'${
        app.commandLine.getSwitchValue('chrono-default-token') ||
        env['CHRONO_DEFAULT_TOKEN'] ||
        generateToken()
      }'`,
    )
    await mkdir(configDir, {
      recursive: true,
    })
    await writeFile(configPath, newConfig)
  }

  const parsedConfig = load(
    await readFile(configPath, 'utf-8'),
  ) as ChronocatConfig
  const { uin } = await getAuthData()

  const validateResult = await validate('ChronocatConfig')(parsedConfig)
  if (validateResult) {
    l.error(new Error(`解析配置时出现问题。${validateResult}`), {
      code: 2154,
      throw: true,
    })
  }

  const result = Object.assign({}, parsedConfig, parsedConfig.overrides?.[uin])
  if ('overrides' in result) delete result.overrides

  config = result
})()

export const getConfig = async () => {
  await task
  return config!
}
