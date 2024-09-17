import type {
  BuddyReq,
  GroupNotifyGuildMemberRemoved,
  GroupNotifyGuildMemberRequest,
  GroupNotifyGuildRequest,
  RedMessage,
} from '@chronocat/red'
import type {
  ChronocatContext,
  ChronocatLogCurrentConfig,
  ChronocatSatoriEventsConfig,
  Event,
  SatoriDispatchMessage,
} from '@chronocat/shell'
import type { O } from 'ts-toolbelt'
import { buildParser } from './parser'

export class MessageCreatedDispatchMessage implements SatoriDispatchMessage {
  constructor(private messages: RedMessage[]) {}
  type = 'satori' as const

  toSatori = async (
    ctx: ChronocatContext,
    config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  ) =>
    (await Promise.all(this.messages.map(buildParser(ctx, config))))
      .filter(Boolean as unknown as (es: Event[] | undefined) => es is Event[])
      .flat()
      .filter(Boolean as unknown as (e: Event | undefined) => e is Event)
}

export class MessageDeletedDispatchMessage implements SatoriDispatchMessage {
  constructor(private messages: RedMessage[]) {}
  type = 'satori' as const

  toSatori = async (
    ctx: ChronocatContext,
    config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  ) =>
    (await Promise.all(this.messages.map(buildParser(ctx, config))))
      .filter(Boolean as unknown as (es: Event[] | undefined) => es is Event[])
      .flat()
      .filter(Boolean as unknown as (e: Event | undefined) => e is Event)
      .map((e) => ((e.type = 'message-deleted'), e))
}

export class GuildRequestDispatchMessage implements SatoriDispatchMessage {
  constructor(
    private notify: GroupNotifyGuildRequest,
    private uin: string,
  ) {}

  type = 'satori' as const

  toSatori = async (
    ctx: ChronocatContext,
    _config: O.Intersect<
      ChronocatLogCurrentConfig,
      ChronocatSatoriEventsConfig
    >,
  ) => {
    const event: Event = {
      id: undefined as unknown as number,
      type: 'guild-request',

      platform: ctx.chronocat.platform,
      self_id: undefined as unknown as string,
      timestamp: new Date().getTime(),

      guild: {
        id: this.notify.group.groupCode,
        name: this.notify.group.groupName,
        avatar: `https://p.qlogo.cn/gh/${this.notify.group.groupCode}/${this.notify.group.groupCode}/640`,
      },

      user: {
        id: `${this.uin}`,
        name: this.notify.user2.nickName,
        avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${this.uin}&spec=640`,
      },

      member: {
      },

      message: {
        id: undefined as unknown as string,
        content: this.notify.postscript,
      },
    }

    return [event]
  }
}

export class GuildMemberRequestDispatchMessage
  implements SatoriDispatchMessage
{
  constructor(
    private notify: GroupNotifyGuildMemberRequest,
    private uin: string,
  ) {}

  type = 'satori' as const

  toSatori = async (
    ctx: ChronocatContext,
    _config: O.Intersect<
      ChronocatLogCurrentConfig,
      ChronocatSatoriEventsConfig
    >,
  ) => {
    const event: Event = {
      id: undefined as unknown as number,
      type: 'guild-member-request',

      platform: ctx.chronocat.platform,
      self_id: undefined as unknown as string,
      timestamp: new Date().getTime(),

      guild: {
        id: this.notify.group.groupCode,
        name: this.notify.group.groupName,
        avatar: `https://p.qlogo.cn/gh/${this.notify.group.groupCode}/${this.notify.group.groupCode}/640`,
      },

      user: {
        id: `${this.uin}`,
        name: this.notify.user2.nickName,
        avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${this.uin}&spec=640`,
      },

      member: {
      },

      message: {
        id: undefined as unknown as string,
        content: this.notify.postscript,
      },
    }

    return [event]
  }
}

export class GuildMemberRemovedDispatchMessage
  implements SatoriDispatchMessage
{
  constructor(
    private notify: GroupNotifyGuildMemberRemoved,
    private uin: string,
  ) {}

  type = 'satori' as const

  toSatori = async (
    ctx: ChronocatContext,
    _config: O.Intersect<
      ChronocatLogCurrentConfig,
      ChronocatSatoriEventsConfig
    >,
  ) => {
    const event: Event = {
      id: undefined as unknown as number,
      type: 'guild-member-removed',

      platform: ctx.chronocat.platform,
      self_id: undefined as unknown as string,
      timestamp: new Date().getTime(),

      guild: {
        id: this.notify.group.groupCode,
        name: this.notify.group.groupName,
        avatar: `https://p.qlogo.cn/gh/${this.notify.group.groupCode}/${this.notify.group.groupCode}/640`,
      },

      user: {
        id: `${this.uin}`,
        name: this.notify.user2.nickName,
        avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${this.uin}&spec=640`,
      },

      member: {
      },

      message: {
        id: undefined as unknown as string,
        content: this.notify.postscript,
      },
    }

    return [event]
  }
}

export class FriendRequestDispatchMessage implements SatoriDispatchMessage {
  constructor(
    private buddyReq: BuddyReq,
    private uin: string,
  ) {}

  type = 'satori' as const

  toSatori = async (
    ctx: ChronocatContext,
    _config: O.Intersect<
      ChronocatLogCurrentConfig,
      ChronocatSatoriEventsConfig
    >,
  ) => {
    const event: Event = {
      id: undefined as unknown as number,
      type: 'friend-request',

      platform: ctx.chronocat.platform,
      self_id: undefined as unknown as string,
      timestamp: Number(this.buddyReq.reqTime) * 1000,
    }

    event.user = {
      id: `${this.uin}`,
      name: this.buddyReq.friendNick,
      avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${this.uin}&spec=640`,
    }

    return [event]
  }
}
