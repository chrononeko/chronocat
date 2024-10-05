import type {
  Element,
  MsgsIncludeSelf,
  OnAddSendMsg,
  OnBuddyListChange,
  OnBuddyReqChange,
  OnGroupListUpdate,
  OnGroupSingleScreenNotifies,
  OnMemberInfoChange,
  OnMemberListChange,
  OnMsgInfoListUpdate,
  OnOpenParamChange,
  OnProfileChanged,
  OnProfileSimpleChanged,
  OnRecentContactListChangedVer2,
  OnRecvMsg,
  Peer,
  RedIpcDataEvent,
  RedIpcDataRequest,
  RedMessage,
} from '@chronocat/red'
import { ChatType, MsgType, SendType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { IpcManData } from 'ipcman'
import {
  emittedBuddyReqList,
  emittedGuildMemberRemovedList,
  emittedGuildMemberRequestList,
  emittedGuildRequestList,
  groupMap,
  requestMethodMap,
  sendQueue,
} from './globalVars'
import {
  FriendRequestDispatchMessage,
  GuildMemberRemovedDispatchMessage,
  GuildMemberRequestDispatchMessage,
  GuildRequestDispatchMessage,
  MessageCreatedDispatchMessage,
  MessageDeletedDispatchMessage,
} from './messages'

export const buildHandler = (ctx: ChronocatContext) => (data: IpcManData) => {
  switch (data.type) {
    case 'event': {
      if (!data.args[1] || !Array.isArray(data.args[1])) return
      const d = data.args[1] as [RedIpcDataEvent]
      if (!d.length) return
      const e = d[0]
      if (!e || !('cmdName' in e)) return
      void dispatcher(ctx, data.channel, e.cmdName, e.payload)
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
      void dispatcher(
        ctx,
        data.channel,
        method,
        data.args[1] /* RedIpcDataResponse */,
      )
      return
    }
  }
}

const dispatcher = async (
  ctx: ChronocatContext,
  channel: string,
  method: string,
  payload: unknown,
) => {
  switch (method) {
    case 'nodeIKernelMsgListener/onRecvActiveMsg':
    case 'nodeIKernelMsgListener/onRecvMsg': {
      if (channel !== 'IPC_DOWN_2') return

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

    case 'nodeIKernelMsgService/getAioFirstViewLatestMsgsAndAddActiveChat': {
      const { msgList } = payload as OnRecvMsg

      for (const msg of msgList) {
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      return
    }

    case 'nodeIKernelProfileListener/onProfileSimpleChanged':
    case 'nodeIKernelProfileListener/onProfileDetailInfoChanged':
    case 'nodeIKernelGroupListener/onSearchMemberChange':
    case 'nodeIKernelGroupService/getNextMemberList': {
      // const authData = await ctx.chronocat.getAuthData()

      const { profiles, infos, info } = payload as OnProfileChanged

      // if (profiles.get(authData.uid))
      //   selfProfile.value = profiles.get(authData.uid)

      if (info) ctx.chronocat.uix.add(info.uid, info.uin)

      const profile = profiles ?? infos
      if (profile)
        for (const [uid, { uin }] of profile) ctx.chronocat.uix.add(uid, uin)

      return
    }

    case 'onProfileSimpleChanged': {
      const { profiles } = payload as OnProfileSimpleChanged

      if (profiles)
        for (const uid in profiles)
          ctx.chronocat.uix.add(uid, profiles[uid]!.uin)

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

    case 'onOpenParamChange': {
      const { data } = payload as OnOpenParamChange

      for (const contact of data) {
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

    case 'onGroupListUpdate':
    case 'nodeIKernelGroupListener/onGroupListUpdate': {
      const { groupList } = payload as OnGroupListUpdate

      for (const group of groupList) groupMap[group.groupCode] = group

      return
    }

    case 'nodeIKernelGroupListener/onGroupSingleScreenNotifies': {
      const { doubt, notifies } = payload as OnGroupSingleScreenNotifies

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      notifies.forEach(async (x) => {
        switch (x.type) {
          case 1: {
            // guild-request
            if (x.status !== 1) return

            const uin = await ctx.chronocat.uix.getUin2(x.user2.uid)
            if (!uin) {
              ctx.chronocat.l.error('内部错误', { code: 2152 })
              return
            }

            const key = `${x.group.groupCode}:${uin}:${x.seq}`
            if (emittedGuildRequestList.includes(key)) return
            emittedGuildRequestList.push(key)

            ctx.chronocat.emit(new GuildRequestDispatchMessage(x, uin))

            return
          }

          case 7: {
            // guild-member-request
            if (x.status !== 1) return

            const uin = await ctx.chronocat.uix.getUin2(x.user1.uid)
            if (!uin) {
              ctx.chronocat.l.error('内部错误', { code: 2152 })
              return
            }

            const key = `${x.group.groupCode}:${uin}:${x.seq}`
            if (emittedGuildMemberRequestList.includes(key)) return
            emittedGuildMemberRequestList.push(key)

            // x.actionUser 此时一定为空

            ctx.chronocat.emit(
              new GuildMemberRequestDispatchMessage(x, uin, doubt),
            )

            return
          }

          case 11: {
            // guild-member-removed

            const uin = await ctx.chronocat.uix.getUin2(x.user1.uid)
            if (!uin) {
              ctx.chronocat.l.error('内部错误', { code: 2152 })
              return
            }

            const key = `${x.group.groupCode}:${uin}:${x.seq}`
            if (emittedGuildMemberRemovedList.includes(key)) return
            emittedGuildMemberRemovedList.push(key)

            // x.actionUser 此时一定为空

            ctx.chronocat.emit(new GuildMemberRemovedDispatchMessage(x, uin))

            return
          }

          // case 8: {
          //   return
          // }
        }
      })

      return
    }

    case 'onBuddyListChange':
    case 'nodeIKernelBuddyListener/onBuddyListChange': {
      const { data, buddyCategory, userSimpleInfos } =
        payload as OnBuddyListChange

      if (data) {
        for (const category of data)
          for (const buddy of category.buddyList)
            ctx.chronocat.uix.add(buddy.uid, buddy.uin)
      } else if (buddyCategory && userSimpleInfos) {
        for (const uid in userSimpleInfos)
          ctx.chronocat.uix.add(uid, userSimpleInfos[uid]!.uin)
      }

      return
    }

    case 'nodeIKernelBuddyListener/onBuddyReqChange': {
      const { buddyReqs } = payload as OnBuddyReqChange

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      buddyReqs.forEach(async (x) => {
        if (x.reqType !== 1 || x.reqSubType !== 1) return

        const uin = await ctx.chronocat.uix.getUin2(x.friendUid)
        if (!uin) {
          ctx.chronocat.l.error('内部错误', { code: 2152 })
          return
        }

        const key = `${uin}:${x.reqTime}`
        if (emittedBuddyReqList.includes(key)) return

        emittedBuddyReqList.push(key)

        ctx.chronocat.emit(new FriendRequestDispatchMessage(x, uin))
      })

      return
    }

    case 'nodeIKernelMsgListener/onAddSendMsg': {
      const { msgRecord } = payload as OnAddSendMsg
      // msgRecord.sendStatus === 1, sending
      sendQueue.push(msgRecord.msgId)
      return
    }

    case 'nodeIKernelMsgListener/onMsgInfoListUpdate': {
      const { msgList } = payload as OnMsgInfoListUpdate

      for (const msg of msgList) {
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      if (channel !== 'IPC_DOWN_2') return

      msgList
        .filter((x) => x.sendStatus > 1 && sendQueue.find((y) => x.msgId === y))
        .forEach((x) => {
          sendQueue.splice(sendQueue.indexOf(x.msgId), 1)
          ctx.chronocat.emit(new MessageCreatedDispatchMessage([x]))
        })

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
