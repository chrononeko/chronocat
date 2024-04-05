import type { Element, Peer, RedMessage } from '@chronocat/red'
import { ChatType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { O } from 'ts-toolbelt'
import { multiForwardMsgWithComment, sendMsg } from '../definitions/msgService'
import { sendQueue } from '../globalVars'

export const commonSend = async (
  ctx: ChronocatContext,
  peer: Partial<Peer>,
  elements: O.Partial<Element, 'deep'>[],
) => {
  const param = {
    msgId: '0',
    msgAttributeInfos: new Map(),
    peer:
      peer.chatType === ChatType.Private
        ? {
            chatType: ChatType.Private,
            peerUid: ctx.chronocat.uix.getUid(peer.peerUid!)!,
          }
        : (peer as Peer),
    msgElements: elements,
  } as const

  return new Promise<RedMessage>((resolve, reject) => {
    sendQueue.push(resolve)

    void sendMsg(param)

    setTimeout(() => {
      const index = sendQueue.indexOf(resolve)
      if (index >= 0) {
        sendQueue.splice(index, 1)
        reject()
      }
    }, ctx.chronocat.timeout)
  })
}

const defaultSendForwardCover = '（Chronocat 合并转发）'

const defaultSrcContact: Peer = {
  chatType: ChatType.Group,
  peerUid: '10000000',
  guildId: '',
}

export let sendForwardMsgBuffer = Buffer.alloc(0)
export let sendForwardCover = defaultSendForwardCover

let task = Promise.resolve<RedMessage>(undefined as unknown as RedMessage)

export const commonSendForward = async (
  ctx: ChronocatContext,
  peer: Partial<Peer>,
  infos: {
    msgId: string
    senderShowName: string
  }[],
  source?: Partial<Peer> | undefined,
) => {
  const srcContact = source
    ? source.chatType === ChatType.Private
      ? {
          chatType: ChatType.Private,
          peerUid: ctx.chronocat.uix.getUid(source.peerUid!)!,
        }
      : (source as Peer)
    : defaultSrcContact

  const dstContact =
    peer.chatType === ChatType.Private
      ? {
          chatType: ChatType.Private,
          peerUid: ctx.chronocat.uix.getUid(peer.peerUid!)!,
        }
      : (peer as Peer)

  task = task
    .then(() => ctx.chronocat.sleep(80) as unknown as RedMessage)
    .then(
      () =>
        new Promise<RedMessage>((resolve, reject) => {
          sendForwardMsgBuffer = Buffer.alloc(0)
          sendForwardCover = defaultSendForwardCover

          sendQueue.push(resolve)

          void multiForwardMsgWithComment({
            msgInfos: infos,
            srcContact,
            dstContact,
            commentElements: [],
          })

          setTimeout(() => {
            const index = sendQueue.indexOf(resolve)
            if (index >= 0) {
              sendQueue.splice(index, 1)
              reject()
            }
          }, ctx.chronocat.timeout)
        }),
    )
    .catch((e) => console.log(e) as unknown as RedMessage)

  return task
}
