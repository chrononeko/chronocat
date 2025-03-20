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
  GuildMemberTitleSetPayload,
  GuildRemovePayload,
  Login,
  Message,
  MessageCreatePayload,
  MessageDeletePayload,
  MessageGetPayload,
  MessageListPayload,
  MessageListResponse,
  Next,
  PuTongDeJieKou1Payload,
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
import type { mime } from './services/mime'
import type { getSelfProfile } from './services/selfProfile'
import type { uix } from './services/uix'
import type { validate } from './services/validate'
import type { PLATFORM, ADAPTER } from './utils/consts'
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
    mime: typeof mime
    platform: typeof PLATFORM
    adapter: typeof ADAPTER
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

export interface InternalMediaNtsilkEncodePayload {
  srcPath: string
  dstPath: string
}

export interface InternalMediaNtsilkEncodeResponse {
  duration: number | undefined
  waveAmplitudes: number[] | undefined
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
  'guild.member.approve': [[ApprovePayload], Record<string, never>]

  'chronocat.guild.member.title.set': [
    [GuildMemberTitleSetPayload],
    Record<string, never>,
  ]

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

  'chronocat.putongdejiekou1': [[PuTongDeJieKou1Payload], Record<string, never>]
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
  'chronocat.internal.message.create.poke': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Message[],
  ]
  'chronocat.internal.message.create.markdown': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Message[],
  ]

  'chronocat.internal.message.create2.normal': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Event[],
  ]
  'chronocat.internal.message.create2.forward': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Event[],
  ]
  'chronocat.internal.message.create2.forward.fake': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Event[],
  ]
  'chronocat.internal.message.create2.poke': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Event[],
  ]
  'chronocat.internal.message.create2.markdown': [
    [MessageCreatePayload, ChronocatSatoriServerConfig],
    Event[],
  ]

  'chronocat.internal.red.message.parse': [
    [RedMessage, ChronocatSatoriServerConfig],
    Event[] | undefined,
  ]

  'chronocat.internal.assets.get': [[string], string]

  'chronocat.internal.qface.get': [[string], QFace | undefined]
  'chronocat.internal.qface.list': [[], QFace[] | undefined]

  'chronocat.internal.uix.uin.get': [[string], string | undefined]
  'chronocat.internal.uix.uin.get.group': [[string, string], string | undefined]

  'chronocat.internal.media.ntsilk.encode': [
    [InternalMediaNtsilkEncodePayload],
    InternalMediaNtsilkEncodeResponse,
  ]
}

export type Methods = SatoriMethods & CCInternalMethods
