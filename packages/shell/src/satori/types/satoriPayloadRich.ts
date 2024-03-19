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
  GuildRemovePayload,
  MessageDeletePayload,
  MessageGetPayload,
  MessageListPayload,
  MessageListResponse,
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
