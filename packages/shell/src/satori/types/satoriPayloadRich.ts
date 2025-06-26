import type h from '@satorijs/element'
import type { Op } from './satoriEntity'

export type {
  ApprovePayload,
  ChannelGetPayload,
  ChannelListPayload,
  ChannelListResponse,
  ChannelMemberMutePayload,
  ChannelMutePayload,
  FriendListResponse,
  GuildGetPayload,
  GuildListResponse,
  GuildMemberGetPayload,
  GuildMemberKickPayload,
  GuildMemberListPayload,
  GuildMemberListResponse,
  GuildMemberMutePayload,
  GuildMemberTitleSetPayload,
  GuildRemovePayload,
  MessageDeletePayload,
  MessageGetPayload,
  MessageListPayload,
  MessageListResponse,
  Next,
  PuTongDeJieKou1Payload,
  UserGetPayload,
  UserPayload,
} from './satoriPayloadEntity'

export type WebSocketIncomingMessage =
  | WebSocketIncomingHeartbeatMessage
  | WebSocketIncomingVerifyMessage
  | WebSocketIncomingUpdateMetaMessage

export interface WebSocketIncomingHeartbeatMessage {
  op: Op.Ping
  body: never
}

export interface WebSocketIncomingVerifyMessage {
  op: Op.Identify
  body?: {
    token?: string
  }
}

export interface WebSocketIncomingUpdateMetaMessage {
  op: Op.Meta
  body: {
    proxy_urls: string[]
  }
}

export interface MessageCreatePayload {
  channel_id: string
  content: h[]
  referrer?: string
}
