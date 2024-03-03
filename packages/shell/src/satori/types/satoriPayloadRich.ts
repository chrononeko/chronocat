import type h from '@satorijs/element'
import type { Op } from './satoriEntity'

export type {
  ApprovePayload,
  FriendListResponse,
  GuildListResponse,
  GuildMemberListPayload,
  GuildMemberListResponse,
  GuildRemovePayload,
  MessageDeletePayload,
  MessageGetPayload,
  Next,
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
  content: h.Fragment
}
