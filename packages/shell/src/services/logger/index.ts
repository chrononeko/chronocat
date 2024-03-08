import { Logiri, link } from 'logiri'
import { spawn } from 'node:child_process'
import type { FileHandle } from 'node:fs/promises'
import { mkdir, open, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { env, platform } from 'node:process'
import type { Event } from '../../satori/types'
import { exists } from '../../utils/fs'
import { formatTimeforFilename, p2, p4 } from '../../utils/string'
import { timeout } from '../../utils/time'
import { getAuthData } from '../authData'
import { baseDir } from '../baseDir'
import { getConfig } from '../config'
import { logiriMessageCreated } from './logiri'
import { ColorFormatter, grey, red, yellow } from '../../utils/colors'

interface LogOptions {
  code?: number

  /**
   * 打印错误日志后仍然抛出异常。仅用于阻断后续逻辑执行。
   */
  throw?: boolean

  // init: boolean | undefined
}

type Level = 'I' | 'S' | 'W' | 'E' | 'D' | 'M'

class ChronocatLogger {
  private file: FileHandle | null = null
  private online = false
  private uin: string | null = null
  private isDebug = false

  private logiri: Logiri

  private task = Promise.resolve()

  private init: Promise<void>

  constructor() {
    this.logiri = new Logiri()
    this.logiri.register(logiriMessageCreated)

    this.init = (async () => {
      const dir = join(baseDir, 'logs')
      await mkdir(dir, {
        recursive: true,
      })

      const logName = formatTimeforFilename()
      const logPath = join(dir, `${logName}.log`)
      this.file = await open(logPath, 'a')
      void openLogWindow(logName, logPath)
    })()

    void this.init.then(async () => {
      const authData = await getAuthData()
      this.uin = `[${authData.uin.slice(-4)}]`
      this.online = true
      const config = await getConfig()
      this.isDebug = config.log?.debug || false
    })
  }

  private getPrefix = () =>
    `${(this.online && this.uin) ||
    grey('[    ]')
    }`

  private writeConsole = (output: string) => void console.log(output)

  private writeFile = (output: string) =>
    void (this.task = this.task.then(async () => {
      await this.init
      // if (!options?.init) await this.auth
      await this.file!.write(output + '\n')
    }))

  write = (output: string) => {
    this.writeConsole(output)
    this.writeFile(output)
  }

  parse = (data: Event) => {
    void (async () => {
      const result = await this.logiri.parse(data)
      result.forEach((line) => this.message(line))
    })()
  }

  private message = (m: string) => {
    const output = `${this.getPrefix()}${formatTime()}${formatCode(
      0,
      'M',
    )} ${m}`
    this.write(output)
  }

  info = (m: string | Error, options?: LogOptions) => {
    const output = `${this.getPrefix()}${formatTime()}${formatCode(
      options?.code || 0,
      'I',
    )} ${formatErrorMessage(m)}`
    this.write(output)
    if (options?.throw) throw m
  }

  // success = (m: string | Error, options?: LogOptions) => {
  //   const output = `${this.getPrefix()}${formatTime()}${formatCode(
  //     options?.code || 0,
  //     'S',
  //     styles.green,
  //   )} ${formatErrorMessage(m)}`
  //   this.write(output)
  //   if (options?.throw) throw m
  // }

  warn = (m: string | Error, options?: LogOptions) => {
    const output = `${this.getPrefix()}${formatTime()}${formatCode(
      options?.code || 0,
      'W',
      yellow,
    )} ${formatErrorMessage(m)}`
    this.write(output)
    if (options?.throw) throw m
  }

  error = (m: string | Error, options?: LogOptions) => {
    const output = `${this.getPrefix()}${formatTime()}${formatCode(
      options?.code || 0,
      'E',
      red,
    )} ${formatErrorMessage(m)}`
    this.write(output)
    if (options?.throw) throw m
  }

  debug = (m: string | Error, options?: LogOptions) => {
    if (!this.isDebug) return
    const output = `${this.getPrefix()}${formatTime()}${formatCode(
      options?.code || 0,
      'D',
    )} ${formatErrorMessage(m)}`
    this.write(output)
    if (options?.throw) throw m
  }
}

export const l = new ChronocatLogger()

async function openLogWindow(logName: string, logPath: string) {
  switch (platform) {
    case 'win32': {
      const wt = join(
        env['LOCALAPPDATA'] as string,
        'Microsoft\\WindowsApps\\wt.exe',
      )

      const tmpPath = join(baseDir, 'tmp')
      await mkdir(tmpPath, {
        recursive: true,
      })
      const cmdPath = join(tmpPath, `lw-${logName}.cmd`)
      await writeFile(
        cmdPath,
        `@chcp 65001\r\n@title Chronocat 日志 - 窗口可以安全关闭。\r\n@cls\r\n@powershell Get-Content -Encoding UTF8 -Wait -Path "${logPath}"`,
      )
      spawn((await exists(wt)) ? wt : 'conhost', [cmdPath], {
        shell: false,
        stdio: 'ignore',
      })
      setTimeout(() => void rm(cmdPath), timeout)
      return
    }

    default:
      return
  }
}

function formatCode(code: number, level: Level, color?: ColorFormatter) {
  const p4c = p4(code)
  let result = `${link(
    `[${level}][CH${p4c}]`,
    `https://chronocat.vercel.app/code/${p4c}`,
  )}`
  if (color) result = `${color(result)}`
  else {
    if (!code) result = `${grey(result)}`
  }
  return result
}

function formatErrorMessage(m: string | Error) {
  if (typeof m === 'string') return m
  let e = m
  let message = e.message
  while (true) {
    if (e.cause && e.cause instanceof Error) {
      e = e.cause
      message += ` ${grey('原因：')} ${e.message}`
    } else if (e.cause) {
      message += ` ${grey('原因：')} ${String(e)}`
      break
    } else break
  }
  return message
}

function formatTime() {
  const d = new Date()
  return grey(`[${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(
    d.getHours(),
  )}:${p2(d.getMinutes())}:${p2(d.getSeconds())}]`)
}
