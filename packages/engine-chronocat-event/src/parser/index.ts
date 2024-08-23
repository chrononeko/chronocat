import type {
  JsonGrayTipBusi1061,
  JsonGrayTipBusi1061ItemQq,
  MarketFaceAssetRequest,
  Media,
  RedMessage,
} from '@chronocat/red'
import { AtType, ChatType, FaceType, MsgType, SendType } from '@chronocat/red'
import type {
  Channel,
  ChronocatContext,
  ChronocatLogCurrentConfig,
  ChronocatSatoriEventsConfig,
  Event,
  Guild,
  GuildMember,
} from '@chronocat/shell'
import type h from '@satorijs/element'
import { Buffer } from 'node:buffer'
import type { O } from 'ts-toolbelt'
import { parseMsgTypes } from './msgt'
import { groupMap } from '../globalVars'

export const buildParser =
  (
    ctx: ChronocatContext,
    config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  ) =>
  (message: RedMessage) =>
    parseMessageRecv(ctx, config, message)

export const parseMessageRecv = async (
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  message: RedMessage,
) => {
  const l = ctx.chronocat.l

  const parsed = await parseMessage(ctx, config, message)

  if (!parsed) return undefined

  const result: Event[] = []

  for (const event of parsed) {
    if (!event.message?.id && !event.user?.id) {
      l.warn('satori: parser: 丢弃了一条消息', { code: 2127 })
      continue
    } else if (!event.message?.id)
      l.warn(
        `satori: parser: 来自 ${event.user?.name} (${event.user?.id}) 的消息不带有 messageId，请注意。`,
        { code: 2128 },
      )
    else if (!event.user?.id)
      l.warn(
        `satori: parser: 消息 ${event.message.id} 不带有 userId，请注意。`,
        { code: 2129 },
      )
    else if (!event.user?.name && !event.member?.nick)
      l.warn(
        `satori: parser: 消息 ${event.message.id} 不带有 userName，请注意。`,
        {
          code: 2130,
        },
      )

    result.push(event)
  }

  return result
}

export const parseMessage = async (
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  message: RedMessage,
) => {
  const event: Event = {
    id: undefined as unknown as number,
    type: undefined as unknown as string,

    platform: undefined as unknown as string,
    self_id: undefined as unknown as string,
    timestamp: Number(message.msgTime) * 1000,
  }

  event.user = {
    id: message.senderUin,
    name: (message.sendNickName || undefined) as unknown as string,
    avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${message.senderUin}&spec=640`,
  }

  const ntMsgTypes = parseMsgTypes(message)

  // 无论哪种消息都有 Channel 和 User
  event.channel = {} as Channel

  // 判断消息来源
  switch (ntMsgTypes.chatType) {
    case ChatType.Private:
      event.channel.type = 1 // ChannelType.DIRECT
      event.channel.id = `private:${message.peerUin}`
      event.channel.name = message.peerName
      break

    case ChatType.Group:
      // Guild 和 Member 只有群聊有
      event.guild = {} as Guild
      event.member = {} as GuildMember

      if (message.sendMemberName) event.member.nick = message.sendMemberName

      event.channel.type = 0 // ChannelType.TEXT
      event.channel.id = event.guild.id = message.peerUid
      event.channel.name = event.guild.name =
        groupMap[message.peerUid]!.groupName // message.peerName
      event.guild.avatar = `https://p.qlogo.cn/gh/${message.peerUid}/${message.peerUid}/640`
      break
  }

  if (
    ntMsgTypes.msgType === MsgType.Ark &&
    message.subMsgType === 0 &&
    ntMsgTypes.sendType === SendType.Normal
  )
    // ARK 卡片消息，elementType = 10
    // 不处理
    return undefined
  else if (
    ntMsgTypes.msgType === MsgType.Normal ||
    ntMsgTypes.msgType === MsgType.Value3 ||
    ntMsgTypes.msgType === MsgType.Ptt ||
    ntMsgTypes.msgType === MsgType.Video ||
    ntMsgTypes.msgType === MsgType.WithRecords ||
    ntMsgTypes.msgType === MsgType.Vaule17
  )
    return parseChatMessage(ctx, config, event, message).then((x) => [
      x[0],
      ...x[1],
    ])
  // else if (event.__CHRONO_UNSAFE_NTMSGTYPES__.subMsgType.multiForward)
  //   // 合并转发消息
  //   // multiForwardMsgElement（elementType = 16）内并不带有合并转发的全部内容，
  //   // 需要后续通过 API 再请求
  //   // 考虑到合并转发消息解析需求较少，不调度此 session
  //   return undefined
  else if (
    ntMsgTypes.msgType === MsgType.System && // 5
    message.subMsgType === 8 && // 8
    ntMsgTypes.sendType === SendType.System && // 3
    message.elements[0]!.elementType === 8 && // 8
    message.elements[0]!.grayTipElement!.subElementType === 4 && // 4
    message.elements[0]!.grayTipElement!.groupElement!.type === 1 // 1
  )
    // 新人自行入群
    return await parseGuildMemberAddedMessage(ctx, config, event, message)
  else if (
    ntMsgTypes.msgType === MsgType.System && // 5
    message.subMsgType === 8 && // 8
    ntMsgTypes.sendType === SendType.System && // 3
    message.elements[0]!.elementType === 8 && // 8
    message.elements[0]!.grayTipElement!.subElementType === 4 && // 4
    message.elements[0]!.grayTipElement!.groupElement!.type === 8 // 8
  )
    // 他人被禁言
    return await parseGuildMemberMuteMessage(ctx, config, event, message)
  else if (
    ntMsgTypes.msgType === MsgType.System && // 5
    message.subMsgType === 8 && // 8
    ntMsgTypes.sendType === SendType.System && // 3
    message.elements[0]!.elementType === 8 && // 8
    message.elements[0]!.grayTipElement!.subElementType === 4 && // 4
    message.elements[0]!.grayTipElement!.groupElement!.type === 5 // 5
  )
    // 群名称变更
    return undefined
  else if (
    ntMsgTypes.msgType === MsgType.System && // 5
    message.subMsgType === 12 && // 12
    ntMsgTypes.sendType === SendType.System && // 3
    message.elements[0]!.elementType === 8 && // 8
    message.elements[0]!.grayTipElement!.subElementType === 12 && // 12
    message.elements[0]!.grayTipElement!.xmlElement!.busiType === '1' && // 1
    message.elements[0]!.grayTipElement!.xmlElement!.busiId === '10145' // 10145
  )
    // 旧版群成员邀请新人入群
    return await parseGuildMemberAddedLegacyInviteMessage(
      ctx,
      config,
      event,
      message,
    )
  else if (
    ntMsgTypes.msgType === MsgType.System &&
    message.subMsgType === 17 &&
    ntMsgTypes.sendType === SendType.System
  )
    // 群主禁止群内临时通话
    // 群主禁止群内发起新的群聊
    return undefined
  else if (
    ntMsgTypes.msgType === MsgType.System && // 5
    message.subMsgType === 12 && // 12
    ntMsgTypes.sendType === SendType.System && // 3
    message.elements[0]!.elementType === 8 && // 8
    message.elements[0]!.grayTipElement!.subElementType === 17 && // 17
    message.elements[0]!.grayTipElement!.jsonGrayTipElement!.busiId === '1061' // 1061
  )
    return await parsePokeMessage(ctx, config, event, message)

  return undefined
}

/**
 * 解析聊天消息。
 *
 * @remarks
 * 在消息没有除了消息元素以外的其他属性需要处理的情况下，直接使用此方法。
 */
async function parseChatMessage(
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  event: Event,
  message: RedMessage,
) {
  const [elements, extraEvents] = await parseElements(
    ctx,
    config,
    event,
    message,
  )
  event.type = 'message-created'
  event.message = {
    id: message.msgId,
    content: elements.join(''),
  }
  return [event, extraEvents] as const
}

/**
 * 解析新人自行入群消息。
 *
 * @remarks
 * 通过解析 `grayTipElement`（elementType = 8）中的
 * `groupElement`（subElementType = 4）即可直接提取 QQ 号。
 */
async function parseGuildMemberAddedMessage(
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  event: Event,
  message: RedMessage,
) {
  const [event2, extraEvents] = await parseChatMessage(
    ctx,
    config,
    event,
    message,
  )
  event2.type = 'guild-member-added'

  event2.operator = {
    id: message.elements[0]!.grayTipElement!.groupElement!.adminUin!,
    name: undefined as unknown as string,
  }

  event2.user = {
    id: message.elements[0]!.grayTipElement!.groupElement!.memberUin!,
    name: message.elements[0]!.grayTipElement!.groupElement!.memberNick!,
    avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${
      message.elements[0]!.grayTipElement!.groupElement!.memberUin
    }&spec=640`,
  }

  if (!event2.member) event2.member = {}

  return [event2, ...extraEvents]
}

/**
 * 解析他人被禁言消息。
 */
async function parseGuildMemberMuteMessage(
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  event: Event,
  message: RedMessage,
) {
  const [event2, extraEvents] = await parseChatMessage(
    ctx,
    config,
    event,
    message,
  )
  if (
    Number(message.elements[0]!.grayTipElement!.groupElement!.shutUp!.duration)
  )
    event2.type = 'unsafe-guild-mute'
  else event2.type = 'unsafe-guild-unmute'

  event2.operator = {
    id: message.elements[0]!.grayTipElement!.groupElement!.shutUp!.admin.uin,
    name: undefined as unknown as string,
  }

  event2.user = {
    id: message.elements[0]!.grayTipElement!.groupElement!.shutUp!.member.uin,
    name: message.elements[0]!.grayTipElement!.groupElement!.shutUp!.member
      .name,
    avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${
      message.elements[0]!.grayTipElement!.groupElement!.shutUp!.member.uin
    }&spec=640`,
  }

  if (event2.member) delete event2.member

  return [event2, ...extraEvents]
}

const regexGuildMemberAddedLegacyInviteMessage = /jp="(\d+)".*jp="(\d+)"/gim

/**
 * 解析旧版群成员邀请新人入群消息。使用 NT
 * 以前的客户端邀请他人加群会收到此消息。
 *
 * @remarks
 * 遗憾地，旧版群成员邀请新人入群消息不存在能够直接获取成员 QQ
 * 号的方法。需要通过解析 `grayTipElement`（elementType = 8）中的
 * `xmlElement`（subElementType = 12）中的 HTML 来提取 QQ 号。
 *
 * 一个 HTML 的示例：
 *
 * ```html
 * <gtip align="center">
 *   <qq uin="u_0gvBEjIEEOk5-EypJRjwxw" col="3" jp="1302744182" />
 *   <nor txt="邀请"/>
 *   <qq uin="u_ENIKFfFS74WSiKNoA6ERWg" col="3" jp="2953529126" />
 *   <nor txt="加入了群聊。"/>
 * </gtip>
 * ```
 *
 * 目前使用正则进行 QQ 号的提取。如果未来正则失效，则应考虑使用 cheerio
 * 进行提取。
 */
async function parseGuildMemberAddedLegacyInviteMessage(
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  event: Event,
  message: RedMessage,
) {
  const [event2, extraEvents] = await parseChatMessage(
    ctx,
    config,
    event,
    message,
  )
  event2.type = 'guild-member-added'

  const execArr = regexGuildMemberAddedLegacyInviteMessage.exec(
    message.elements[0]!.grayTipElement!.xmlElement!.content!,
  )
  if (!Array.isArray(execArr) || execArr.length < 3) return undefined
  const [_, operatorId, userId] = execArr

  event2.operator = {
    id: operatorId!,
    name: undefined as unknown as string,
  }

  event2.user = {
    id: userId!,
    name: undefined as unknown as string,
    avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${userId}&spec=640`,
  }

  if (!event2.member) event2.member = {}

  return [event2, ...extraEvents]
}

async function parsePokeMessage(
  ctx: ChronocatContext,
  _config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  event: Event,
  message: RedMessage,
) {
  const json = JSON.parse(
    message.elements[0]!.grayTipElement!.jsonGrayTipElement!.jsonStr,
  ) as JsonGrayTipBusi1061

  const [operator, user] = json.items.filter((x) => x.type == 'qq') as [
    JsonGrayTipBusi1061ItemQq,
    JsonGrayTipBusi1061ItemQq,
  ]

  event.type = 'message-created'
  event.message = {
    id: message.msgId,
    content: `<${ctx.chronocat.platform}:poke user-id="${await ctx.chronocat.uix.getUin2(user.uid, event.guild?.id)}" operator-id="${await ctx.chronocat.uix.getUin2(operator.uid, event.guild?.id)}"/>`,
  }

  return [event]
}

/**
 * 解析消息元素。
 */
async function parseElements(
  ctx: ChronocatContext,
  config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>,
  event: Event,
  message: RedMessage,
) {
  const l = ctx.chronocat.l

  const elements: h[] = []
  const extraEvents: Event[] = []

  for (const m of message.elements) {
    switch (m.elementType) {
      case 1: {
        // 文本消息
        switch (m.textElement!.atType) {
          case AtType.None: {
            // 纯文本消息
            elements.push(
              ctx.chronocat.h.text(
                m
                  .textElement!.content.replaceAll('\r\n', '\n')
                  .replaceAll('\r', '\n'),
              ),
            )
            break
          }

          case AtType.Normal: {
            // at 消息
            ctx.chronocat.uix.add(m.textElement!.atNtUid, m.textElement!.atUid)

            let id: string | undefined = m.textElement!.atUid
            if (id === '0') id = undefined
            id ||= await ctx.chronocat.uix.getUin2(
              m.textElement!.atNtUid,
              event.guild?.id,
            )

            const name = m.textElement!.content.slice(1)

            if (!id) {
              l.warn(
                `satori: parser: at 目标 ${name} 不带有 id，将跳过该元素。`,
                { code: 2131 },
              )
              break
            }

            elements.push(
              ctx.chronocat.h('at', {
                id,
                name,
              }),
            )

            break
          }
        }
        break
      }

      case 2: {
        // 图片消息
        elements.push(
          ctx.chronocat.h('img', {
            src: `${config.self_url}/v1/assets/${Buffer.from(
              JSON.stringify({
                type: 'mediav1',
                msgId: message.msgId,
                chatType: message.chatType,
                peerUid: message.peerUid,
                elementId: m.elementId,
                thumbSize: m.picElement!.thumbFileSize,
              } satisfies Media),
            ).toString('base64url')}`,
          }),
        )
        break
      }

      case 3: {
        // 文件消息
        elements.push(
          ctx.chronocat.h('file', {
            src: `${config.self_url}/v1/assets/${Buffer.from(
              JSON.stringify({
                type: 'mediav1',
                msgId: message.msgId,
                chatType: message.chatType,
                peerUid: message.peerUid,
                elementId: m.elementId,
                thumbSize: m.fileElement!.thumbFileSize,
              } satisfies Media),
            ).toString('base64url')}`,
          }),
        )
        break
      }

      case 4: {
        // 语音消息
        elements.push(
          ctx.chronocat.h('audio', {
            src: `${config.self_url}/v1/assets/${Buffer.from(
              JSON.stringify({
                type: 'mediav1',
                msgId: message.msgId,
                chatType: message.chatType,
                peerUid: message.peerUid,
                elementId: m.elementId,
                thumbSize: 0,
              } satisfies Media),
            ).toString('base64url')}`,
          }),
        )
        break
      }

      case 5: {
        // 视频消息
        elements.push(
          ctx.chronocat.h('video', {
            src: `${config.self_url}/v1/assets/${Buffer.from(
              JSON.stringify({
                type: 'mediav1',
                msgId: message.msgId,
                chatType: message.chatType,
                peerUid: message.peerUid,
                elementId: m.elementId,
                thumbSize: m.videoElement!.thumbSize,
              } satisfies Media),
            ).toString('base64url')}`,
          }),
        )
        break
      }

      case 6: {
        // 表情
        switch (m.faceElement!.faceType) {
          case FaceType.PCPoke: {
            elements.push(
              ctx.chronocat.h(`${ctx.chronocat.platform}:pcpoke`, {
                id: m.faceElement!.pokeType,
              }),
            )
            break
          }

          case FaceType.Normal1:
          case FaceType.Normal2:
          case FaceType.Super: {
            elements.push(
              ctx.chronocat.h(`${ctx.chronocat.platform}:face`, {
                id: m.faceElement!.faceIndex,
                name: `[${(await ctx.chronocat.api['chronocat.internal.qface.get'](`${m.faceElement!.faceIndex}`))!.QDes.slice(1)}]`,
                platform: ctx.chronocat.platform,
                'unsafe-super':
                  m.faceElement!.faceType === FaceType.Super ? true : undefined,
                'unsafe-result-id': m.faceElement!.resultId,
                'unsafe-chain-count': m.faceElement!.chainCount,
              }),
            )
            break
          }

          case FaceType.MarketEmoticon: {
            elements.push(
              ctx.chronocat.h(`${ctx.chronocat.platform}:face`, {
                id: m.faceElement!.faceIndex,
                platform: ctx.chronocat.platform,
                'unsafe-market-emoticon': true,
              }),
            )
            break
          }
        }
        break
      }

      case 7: {
        // 引用消息
        const source = message.records.find(
          (x) => x.msgId === m.replyElement!.sourceMsgIdInRecords,
        )!

        elements.push(
          ctx.chronocat.h(
            'quote',
            {
              'chronocat:seq': m.replyElement!.replayMsgSeq,
            },
            [
              await parseAuthor(ctx, source),
              ...(await parseElements(ctx, config, event, source))[0],
            ],
          ),
        )
        break
      }

      case 11: {
        elements.push(
          ctx.chronocat.h(
            `${ctx.chronocat.platform}:marketface`,
            {
              tabId: m.marketFaceElement!.emojiPackageId,
              faceId: m.marketFaceElement!.emojiId,
              key: m.marketFaceElement!.key,
            },
            [
              ctx.chronocat.h('img', {
                src: `${config.self_url}/v1/assets/${Buffer.from(
                  JSON.stringify({
                    type: 'mfacev1',
                    tabId: m.marketFaceElement!.emojiPackageId,
                    faceId: m.marketFaceElement!.emojiId,
                    key: m.marketFaceElement!.key,
                    name: m.marketFaceElement!.faceName,
                    filePath: m.marketFaceElement!.staticFacePath,
                  } satisfies MarketFaceAssetRequest),
                ).toString('base64url')}`,
              }),
            ],
          ),
        )
        break
      }

      case 27: {
        elements.push(
          ctx.chronocat.h(`${ctx.chronocat.platform}:facebubble`, {
            id: m.faceBubbleElement!.faceType,
            count: m.faceBubbleElement!.faceCount,
            name: m.faceBubbleElement!.faceSummary,
            content: m.faceBubbleElement!.content,
          }),
        )
        break
      }

      default:
        break
    }
  }

  return [elements, extraEvents] as const
}

async function parseAuthor(ctx: ChronocatContext, message: RedMessage) {
  return ctx.chronocat.h('author', {
    id: message.senderUin,
    name: message.sendMemberName || message.sendNickName,
    avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${message.senderUin}&spec=640`,
  })
}
