import type { O } from 'ts-toolbelt'
import type { Event, Message, MessageCreatePayload } from './satori/types'
import type { api } from './services/api'
import type { getAuthData } from './services/authData'
import type { baseDir } from './services/baseDir'
import type { getConfig } from './services/config'
import type {
  ChronocatLogCurrentConfig,
  ChronocatSatoriEventsConfig,
} from './services/config/configEntity'
import type { l } from './services/logger'
import type { getSelfProfile } from './services/selfProfile'
import type { uix } from './services/uix'
import type { validate } from './services/validate'
import type { PLATFORM } from './utils/consts'

export interface ChronocatContext {
  chronocat: {
    api: typeof api
    baseDir: typeof baseDir
    emit: (message: DispatchMessage) => void
    getAuthData: typeof getAuthData
    getConfig: typeof getConfig
    getSelfProfile: typeof getSelfProfile
    l: typeof l
    platform: typeof PLATFORM
    uix: typeof uix
    validate: typeof validate
    whenReady: () => Promise<void>
  }
}

export interface Engine {
  name: string
  version: string
  apply: (ctx: ChronocatContext) => unknown
}

export type DispatchMessage = SatoriDispatchMessage | SelfProfileDispatchMessage

export interface SatoriDispatchMessage {
  type: 'satori'

  toSatori: (
    selfId: string,
    config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  ) => Promise<Event[]>
}

export interface SelfProfileDispatchMessage {
  type: 'unsafe-selfprofile'

  getSelfProfile: () => Promise<{
    nick: string
  }>
}

export interface Methods {
  // Satori

  'message.create': [[MessageCreatePayload], Message[]]

  // Internal

  'chronocat.internal.assets.get': [[string], string]
}
