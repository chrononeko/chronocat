import type { QFace, RedMessage } from '@chronocat/red'
import type h from '@satorijs/element'
import type styles from 'ansi-styles'
import type { O } from 'ts-toolbelt'
import type {
  ChannelMemberMutePayload,
  ChannelMutePayload,
  Event,
  Login,
  Message,
  MessageCreatePayload,
} from './satori/types'
import type { api } from './services/api'
import type { getAuthData } from './services/authData'
import type { baseDir } from './services/baseDir'
import type { getConfig } from './services/config'
import type {
  ChronocatLogCurrentConfig,
  ChronocatSatoriEventsConfig,
  ChronocatSatoriServerConfig,
} from './services/config/configEntity'
import type { l } from './services/logger'
import type { getSelfProfile } from './services/selfProfile'
import type { uix } from './services/uix'
import type { validate } from './services/validate'
import type { PLATFORM } from './utils/consts'
import type { exists } from './utils/fs'
import type { sleep, timeout } from './utils/time'

export interface ChronocatContext {
  chronocat: {
    api: typeof api
    baseDir: typeof baseDir
    emit: (message: DispatchMessage) => void
    exists: typeof exists
    getAuthData: typeof getAuthData
    getConfig: typeof getConfig
    getSelfProfile: typeof getSelfProfile
    h: typeof h
    l: typeof l
    platform: typeof PLATFORM
    sleep: typeof sleep
    styles: typeof styles
    timeout: typeof timeout
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
    ctx: ChronocatContext,
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

  'unsafe.channel.mute': [[ChannelMutePayload], Record<string, never>]
  'unsafe.channel.member.mute': [
    [ChannelMemberMutePayload],
    Record<string, never>,
  ]

  'message.create': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Message[],
  ]

  'login.get': [[], Login]

  // Internal

  'chronocat.internal.notimpl': [[], never]

  'chronocat.internal.message.create.forward': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Message[],
  ]
  'chronocat.internal.message.create.forward.fake': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Message[],
  ]

  'chronocat.internal.red.message.parse': [
    [RedMessage, ChronocatSatoriServerConfig],
    Event[] | undefined,
  ]

  'chronocat.internal.assets.get': [[string], string]

  'chronocat.internal.qface.get': [[string], QFace | undefined]
  'chronocat.internal.qface.list': [[], QFace[] | undefined]
}
