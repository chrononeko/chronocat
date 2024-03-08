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
  GuildRemovePayload,
  MessageDeletePayload,
  MessageGetPayload,
  Next,
  UserGetPayload,
  UserPayload,
} from './satoriPayloadEntity'

export type WebSocketIncomingMessage =
  | WebSocketIncomingHeartbeatMessage
  | WebSocketIncomingVerifyMessage

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

export interface MessageCreatePayload {
  channel_id: string
  content: h[]
}
