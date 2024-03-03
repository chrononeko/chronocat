import type { Guild, GuildMember, User } from './satoriEntity'

export interface Next {
  /**
   * @title 分页令牌
   *
   * @description 获取下一页时提供的分页令牌，获取第一页时为空。
   */
  next?: string
}

export interface MessageCreatePayload {
  /**
   * @title 目标频道
   *
   * @description 消息要发送到的频道。
   *
   * 在 Chronocat，群聊对应的频道为群号，
   * 私聊对应的频道为 private: 后跟 QQ 号。
   */
  channel_id: string

  /**
   * @title 消息内容
   *
   * @description 消息的内容。
   *
   * 格式为 Satori 消息元素字符串。
   */
  content: string
}

export interface ApprovePayload {
  /**
   * 请求 ID
   */
  message_id: string

  /**
   * 是否通过请求
   */
  approve: boolean

  /**
   * 备注信息
   */
  comment: string | undefined
}

export interface FriendListResponse extends Next {
  data: User[]
}

export interface GuildListResponse extends Next {
  data: Guild[]
}

export interface UserPayload {
  user_id: string

  // 仅限 Chronocat，此处无需 guild_id。
}

export interface GuildMemberListPayload extends Next {
  guild_id: string
}

export interface GuildMemberListResponse extends Next {
  data: GuildMember[]
}

export interface GuildRemovePayload {
  guild_id: string
}

export interface MessageDeletePayload {
  channel_id: string
  message_id: string
}

export interface MessageGetPayload {
  channel_id: string
  message_id: string
}

export interface ChannelMutePayload {
  channel_id: string
  enable: boolean
}

export interface ChannelMemberMutePayload {
  channel_id: string
  user_id: string
  duration: number
}

export interface ChannelListPayload extends Next {
  guild_id: string
}

export interface ChannelGetPayload {
  channel_id: string
}

export interface GuildGetPayload {
  guild_id: string
}

export interface UserGetPayload {
  user_id: string
}

export interface GuildMemberGetPayload {
  guild_id: string
  user_id: string
}

export interface GuildMemberKickPayload {
  guild_id: string
  user_id: string
  permanent?: boolean
}
