import type { BuddyReq, RedMessage } from '@chronocat/red'
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
