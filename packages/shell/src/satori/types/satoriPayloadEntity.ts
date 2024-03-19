import type { Channel, Guild, GuildMember, Message, User } from './satoriEntity'

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

export interface MessageListPayload extends Next {
  channel_id: string
}

export interface MessageListResponse extends Next {
  data: Message[]
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

export interface GuildMemberMutePayload {
  channel_id: string
  user_id: string

  /**
   * @title 禁言时长
   *
   * @description 禁言的时长，单位为毫秒。0
   * 表示解除禁言。应当小于 30 天（259,200,000
   * 毫秒）。目前会对向下取整到秒。
   */
  duration: number

  /**
   * @title 说明信息
   *
   * @description 禁言群组成员的说明。目前会忽略此字段。
   */
  comment?: string
}

export interface ChannelListPayload extends Next {
  guild_id: string
}

export interface ChannelListResponse extends Next {
  data: Channel[]
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
