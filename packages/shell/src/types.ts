/* eslint-disable @typescript-eslint/no-invalid-void-type */

import type { QFace, RedMessage } from '@chronocat/red'
import type h from '@satorijs/element'
import type { O } from 'ts-toolbelt'
import type {
  ApprovePayload,
  Channel,
  ChannelGetPayload,
  ChannelListPayload,
  ChannelListResponse,
  ChannelMemberMutePayload,
  ChannelMutePayload,
  Event,
  FriendListResponse,
  Guild,
  GuildGetPayload,
  GuildListResponse,
  GuildMember,
  GuildMemberGetPayload,
  GuildMemberKickPayload,
  GuildMemberListPayload,
  GuildMemberListResponse,
  GuildMemberMutePayload,
  GuildRemovePayload,
  Login,
  Message,
  MessageCreatePayload,
  MessageDeletePayload,
  MessageGetPayload,
  MessageListPayload,
  MessageListResponse,
  Next,
  User,
  UserGetPayload,
  UserPayload,
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

export interface SatoriMethods {
  'channel.get': [[ChannelGetPayload], Channel]
  'channel.list': [[ChannelListPayload], ChannelListResponse]
  'unsafe.channel.mute': [[ChannelMutePayload], Record<string, never>]
  'unsafe.channel.member.mute': [
    [ChannelMemberMutePayload],
    Record<string, never>,
  ]
  'user.channel.create': [[UserPayload], Channel]

  'guild.get': [[GuildGetPayload], Guild]
  'guild.list': [[], GuildListResponse]
  'guild.approve': [[ApprovePayload], Record<string, never>]
  'guild.remove': [[GuildRemovePayload], Record<string, never>]
  'guild.member.get': [[GuildMemberGetPayload], GuildMember]
  'guild.member.list': [[GuildMemberListPayload], GuildMemberListResponse]
  'guild.member.kick': [[GuildMemberKickPayload], Record<string, never>]
  'guild.member.mute': [[GuildMemberMutePayload], Record<string, never>]

  'message.create': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Message[],
  ]
  'message.get': [[MessageGetPayload], Message]
  'message.delete': [[MessageDeletePayload], Record<string, never>]
  'message.list': [[MessageListPayload], MessageListResponse]

  'login.get': [[], Login]

  'user.get': [[UserGetPayload], User]

  'friend.list': [[Next], FriendListResponse]
  'friend.approve': [[ApprovePayload], Record<string, never>]
  'unsafe.friend.remove': [[UserPayload], Record<string, never>]
}

export interface CCInternalMethods {
  'chronocat.internal.notimpl': [[], void]

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

export type Methods = SatoriMethods & CCInternalMethods
