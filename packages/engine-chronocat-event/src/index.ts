import type {
  Element,
  MsgsIncludeSelf,
  OnBuddyListChange,
  OnBuddyReqChange,
  OnMemberInfoChange,
  OnMemberListChange,
  OnMsgInfoListUpdate,
  OnProfileChanged,
  OnRecentContactListChangedVer2,
  OnRecvMsg,
  Peer,
  RedIpcArgs,
  RedIpcDataEvent,
  RedIpcDataRequest,
  RedMessage,
} from '@chronocat/red'
import { ChatType, MsgType, SendType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { IpcManData } from 'ipcman'
import { ipcMan } from 'ipcman'
import { emittedBuddyReqList, requestMethodMap } from './globalVars'
import {
  FriendRequestDispatchMessage,
  MessageCreatedDispatchMessage,
  MessageDeletedDispatchMessage,
} from './messages'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-event'
export const version = __DEFINE_CHRONO_VERSION__

export const apply = async (ctx: ChronocatContext) => {
  const dispatcher = async (method: string, payload: unknown) => {
    switch (method) {
      case 'nodeIKernelMsgListener/onRecvMsg': {
        const { msgList } = payload as OnRecvMsg

        for (const msg of msgList) {
          ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
          if (msg.chatType === ChatType.Private)
            ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
        }

        // const prepareRole = async (msg: Message) => {
        //   if (msg.chatType === ChatType.Group) {
        //     await getMemberInfo({
        //       forceUpdate: false,
        //       groupCode: +msg.peerUid,
        //       uids: [msg.senderUid],
        //     })
        //   }
        // }

        // const fillRole = (msg: Message) => {
        //   if (msg.chatType === ChatType.Group) {
        //     msg.roleType = roleMap[msg.peerUid]?.[msg.senderUin]
        //   }
        // }

        const filteredPayload = await Promise.all(
          msgList.filter(filterMessage).map(async (msg) => {
            // await prepareRole(msg)
            // msg = await uixCache.preprocessObject(msg)
            // setMsgCache(msg)
            // fillRole(msg)
            return msg
          }),
        )

        if (filteredPayload.length)
          ctx.chronocat.emit(new MessageCreatedDispatchMessage(filteredPayload))

        return
      }

      case 'nodeIKernelProfileListener/onProfileSimpleChanged':
      case 'nodeIKernelProfileListener/onProfileDetailInfoChanged':
      case 'nodeIKernelGroupListener/onSearchMemberChange':
      case 'nodeIKernelGroupService/getNextMemberList': {
        // const authData = await ctx.chronocat.getAuthData()

        const { profiles, infos } = payload as OnProfileChanged

        // if (profiles.get(authData.uid))
        //   selfProfile.value = profiles.get(authData.uid)

        const profile = profiles ?? infos
        for (const [uid, { uin }] of profile) ctx.chronocat.uix.add(uid, uin)

        return
      }

      case 'nodeIKernelGroupListener/onMemberInfoChange': {
        const { members } = payload as OnMemberInfoChange

        for (const [uid, { uin }] of members) {
          ctx.chronocat.uix.add(uid, uin)

          // if (!(groupCode in roleMap)) roleMap[groupCode] = {}
          // roleMap[groupCode][uin] = role
        }
        return
      }

      case 'nodeIKernelGroupListener/onMemberListChange': {
        const { info } = payload as OnMemberListChange

        const groupCode = info.sceneId.split('_')[0]
        if (!groupCode) return

        for (const [uid, { uin }] of info.infos) {
          ctx.chronocat.uix.add(uid, uin)

          // if (!(groupCode in roleMap)) roleMap[groupCode] = {}
          // roleMap[groupCode][uin] = role
        }

        return
      }

      case 'nodeIKernelRecentContactListener/onRecentContactListChangedVer2': {
        const { changedRecentContactLists } =
          payload as OnRecentContactListChangedVer2

        for (const changedRecentContactList of changedRecentContactLists)
          for (const contact of changedRecentContactList.changedList) {
            ctx.chronocat.uix.add(contact.senderUid, contact.senderUin)
            if (contact.chatType === ChatType.Private)
              ctx.chronocat.uix.add(contact.peerUid, contact.peerUin)
          }

        return
      }

      case 'nodeIKernelMsgService/getMsgsIncludeSelf': {
        const { msgList } = payload as MsgsIncludeSelf

        for (const msg of msgList) {
          ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
          if (msg.chatType === ChatType.Private)
            ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
        }

        return
      }

      case 'onBuddyListChange':
      case 'nodeIKernelBuddyListener/onBuddyListChange': {
        const { data } = payload as OnBuddyListChange

        for (const category of data) {
          for (const buddy of category.buddyList) {
            ctx.chronocat.uix.add(buddy.uid, buddy.uin)
          }
        }

        return
      }

      case 'nodeIKernelBuddyListener/onBuddyReqChange': {
        const { buddyReqs } = payload as OnBuddyReqChange

        buddyReqs.forEach((x) => {
          if (x.reqType !== 1 || x.reqSubType !== 1) return

          const uin = ctx.chronocat.uix.getUin(x.friendUid)
          if (!uin) return

          const key = `${uin}:${x.reqTime}`
          if (emittedBuddyReqList.includes(key)) return

          emittedBuddyReqList.push(key)

          ctx.chronocat.emit(new FriendRequestDispatchMessage(x, uin))
        })

        return
      }

      case 'nodeIKernelMsgListener/onMsgInfoListUpdate': {
        const { msgList } = payload as OnMsgInfoListUpdate

        const filteredPayload = await Promise.all(
          msgList
            .filter(
              (x) =>
                x.msgType === MsgType.System &&
                x.subMsgType === 4 &&
                !x.isOnlineMsg &&
                Number(x.recallTime) &&
                x.elements[0]!.elementType === 8 &&
                x.elements[0]!.grayTipElement?.subElementType === 1,
            )
            .filter(filterMessage)
            .map(async (msg) => {
              // await prepareRole(msg)
              // msg = await uixCache.preprocessObject(msg)
              // setMsgCache(msg)
              // fillRole(msg)
              return msg
            }),
        )
        if (filteredPayload.length)
          ctx.chronocat.emit(new MessageDeletedDispatchMessage(filteredPayload))
        return
      }
    }
  }

  const handler = (data: IpcManData) => {
    switch (data.type) {
      case 'event': {
        if (!data.args[1] || !Array.isArray(data.args[1])) return
        const d = data.args[1] as [RedIpcDataEvent]
        if (!d.length) return
        const e = d[0]
        if (!e || !('cmdName' in e)) return
        void dispatcher(e.cmdName, e.payload)
        return
      }

      case 'wrapped-request': {
        requestMethodMap[data.id] = (data.args[1] as RedIpcDataRequest)[0]
        return
      }

      case 'wrapped-response': {
        const method = requestMethodMap[data.id]
        if (!method) return
        delete requestMethodMap[data.id]
        void dispatcher(method, data.args[1] /* RedIpcDataResponse */)
        return
      }
    }
  }

  ipcMan<RedIpcArgs>({
    handler,
    getId: (p) => p?.[0]?.callbackId,
  })

  await ctx.chronocat.whenReady()
}

export const filterMessage = (
  message:
    | {
        peer: Peer
        elements: Element[]
      }
    | RedMessage,
) =>
  'peer' in message
    ? !message.elements.some((x) => x.walletElement || x.arkElement)
    : !(
        message.msgType === MsgType.Ark ||
        message.msgType === MsgType.Wallet ||
        (message.msgType === MsgType.System &&
          message.subMsgType === 17 &&
          message.sendType === SendType.System &&
          message.elements[0]!.elementType === 8 &&
          message.elements[0]!.grayTipElement!.subElementType === 16 &&
          message.elements[0]!.grayTipElement!.jsonGrayTipElement!.busiId ===
            '81')
      )
