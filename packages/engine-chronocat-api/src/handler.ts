import type {
  ContactList,
  MsgsIncludeSelf,
  OnAddSendMsg,
  OnBuddyListChange,
  OnEmojiDownloadComplete,
  OnGroupListUpdate,
  OnMemberInfoChange,
  OnMemberListChange,
  OnMsgInfoListUpdate,
  OnOpenParamChange,
  OnProfileChanged,
  OnRecentContactListChangedVer2,
  OnRecvMsg,
  OnRichMediaDownloadComplete,
  RedIpcDataEvent,
  RedIpcDataRequest,
} from '@chronocat/red'
import { ChatType, ContactListType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { IpcManData } from 'ipcman'
import {
  chronoEventEmitter,
  emojiDownloadMap,
  friendMap,
  groupMap,
  requestCallbackMap,
  requestMethodMap,
  richMediaDownloadMap,
  sendCallbackMap,
  sendQueue,
} from './globalVars'

export const buildHandler = (ctx: ChronocatContext) => (data: IpcManData) => {
  switch (data.type) {
    case 'event': {
      if (!data.args[1] || !Array.isArray(data.args[1])) return
      const d = data.args[1] as [RedIpcDataEvent]
      if (!d.length) return
      const e = d[0]
      if (!e || !('cmdName' in e)) return
      void responseDispatcher(ctx, data.channel, e.cmdName, e.payload)
      return
    }

    case 'wrapped-request': {
      const req = data.args[1] as RedIpcDataRequest
      const method = req[0]
      requestMethodMap[data.id] = method

      void requestDispatcher(ctx, data.channel, method, req.slice(1))

      return
    }

    case 'wrapped-response': {
      const cb = requestCallbackMap[data.id]
      if (cb) cb(data.args[1] /* RedIpcDataResponse */)

      const method = requestMethodMap[data.id]
      if (method) {
        delete requestMethodMap[data.id]
        void responseDispatcher(
          ctx,
          data.channel,
          method,
          data.args[1] /* RedIpcDataResponse */,
        )
      }

      return
    }
  }
}

const requestDispatcher = async (
  ctx: ChronocatContext,
  _channel: string,
  method: string,
  payload: unknown,
) => {
  switch (method) {
    case 'nodeIKernelMsgService/deleteActiveChatByUid': {
      const [peerUid] = payload as [string]

      if (!peerUid) return

      setTimeout(() => {
        ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(
          {
            chatType: ctx.chronocat.uix.isUid(peerUid)
              ? ChatType.Private
              : ChatType.Group,
            peerUid,
            guildId: '',
          },
          true,
        )
      }, 100)

      return
    }
  }
}

const responseDispatcher = async (
  ctx: ChronocatContext,
  _channel: string,
  method: string,
  payload: unknown,
) => {
  switch (method) {
    case 'nodeIKernelMsgListener/onRecvActiveMsg':
    case 'nodeIKernelMsgListener/onRecvMsg': {
      const { msgList } = payload as OnRecvMsg

      for (const msg of msgList) {
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      return
    }

    case 'nodeIKernelMsgListener/onRichMediaDownloadComplete': {
      const { notifyInfo } = payload as OnRichMediaDownloadComplete

      const downloadId = `${notifyInfo.msgId}::${notifyInfo.msgElementId}`

      if (notifyInfo.fileDownType === 1 && richMediaDownloadMap[downloadId]) {
        richMediaDownloadMap[downloadId]!(notifyInfo.filePath)
        delete richMediaDownloadMap[downloadId]
      }

      return
    }

    case 'nodeIKernelMsgListener/onEmojiDownloadComplete': {
      const { notifyInfo } = payload as OnEmojiDownloadComplete

      const downloadId = `${notifyInfo.emojiPackageId}::${notifyInfo.emojiId}`

      if (notifyInfo.downloadType === 0 && emojiDownloadMap[downloadId]) {
        emojiDownloadMap[downloadId]!(notifyInfo.path)
        delete emojiDownloadMap[downloadId]
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

    case 'nodeIKernelGroupListener/onMemberInfoChange': {
      const { members } = payload as OnMemberInfoChange

      for (const [uid, { uin }] of members) {
        ctx.chronocat.uix.add(uid, uin)
      }
      return
    }

    case 'nodeIKernelGroupListener/onMemberListChange': {
      const { info } = payload as OnMemberListChange

      const groupCode = info.sceneId.split('_')[0]
      if (!groupCode) return

      for (const [uid, { uin }] of info.infos) {
        ctx.chronocat.uix.add(uid, uin)
      }

      return
    }

    case 'onGroupListUpdate':
    case 'nodeIKernelGroupListener/onGroupListUpdate': {
      const { groupList } = payload as OnGroupListUpdate

      for (const group of groupList) {
        ctx.chronocatEngineChronocatApi.msgBoxActiv.activate({
          chatType: ChatType.Group,
          peerUid: group.groupCode,
          guildId: '',
        })

        groupMap[group.groupCode] = group
      }

      chronoEventEmitter.emitGroupListUpdate()

      return
    }

    case 'nodeIKernelGroupListener/onGroupNotifiesUnreadCountUpdated': {
      // const {} = payload as OnGroupNotifiesUnreadCountUpdated

      void ctx.chronocatEngineChronocatApi.groupNotify.refresh()

      return
    }

    case 'onBuddyListChange':
    case 'nodeIKernelBuddyListener/onBuddyListChange': {
      const { data, buddyCategory, userSimpleInfos } =
        payload as OnBuddyListChange

      if (data) {
        for (const category of data) {
          for (const buddy of category.buddyList) {
            ctx.chronocat.uix.add(buddy.uid, buddy.uin)

            ctx.chronocatEngineChronocatApi.msgBoxActiv.activate({
              chatType: ChatType.Private,
              peerUid: buddy.uid,
              guildId: '',
            })

            // buddy.category = category.categoryName
            friendMap[buddy.uin] = {
              id: buddy.uin,
              name: buddy.nick,
              nick: buddy.remark || undefined,
              avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${buddy.uin}&spec=640`,
              is_bot: false,
            }
          }
        }

        chronoEventEmitter.emitBuddyListChange()
      } else if (buddyCategory && userSimpleInfos) {
        // 先填充 uix
        for (const uid in userSimpleInfos)
          ctx.chronocat.uix.add(uid, userSimpleInfos[uid]!.uin)

        for (const category of buddyCategory) {
          for (const uid of category.buddyUids) {
            ctx.chronocatEngineChronocatApi.msgBoxActiv.activate({
              chatType: ChatType.Private,
              peerUid: uid,
              guildId: '',
            })

            const userSimpleInfo = userSimpleInfos[uid]!

            friendMap[userSimpleInfo.uin] = {
              id: userSimpleInfo.uin,
              name: userSimpleInfo.coreInfo.nick,
              nick: userSimpleInfo.coreInfo.remark || undefined,
              avatar: `http://thirdqq.qlogo.cn/headimg_dl?dst_uin=${userSimpleInfo.uin}&spec=640`,
              is_bot: false,
            }
          }
        }

        chronoEventEmitter.emitBuddyListChange()
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

    case 'nodeIKernelRecentContactListener/onFirstScreenRecentContactListChanged': {
      const { changedList } = payload as ContactList

      // switch (listType) {
      //   // case ContactListType.Normal: {
      //   //   for (const contact of changedList)
      //   //     if (contact.chatType === ChatType.MsgBox)
      //   //       ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(
      //   //         contact.peerUid,
      //   //       )

      //   //   break
      //   // }

      //   case ContactListType.MsgBox: {
      //     for (const contact of changedList)
      //       if (contact.chatType === ChatType.Group)
      //         ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(
      //           contact.peerUid,
      //         )

      //     break
      //   }
      // }

      for (const contact of changedList) {
        ctx.chronocat.uix.add(contact.senderUid, contact.senderUin)
        if (contact.chatType === ChatType.Private)
          ctx.chronocat.uix.add(contact.peerUid, contact.peerUin)
      }

      return
    }

    case 'nodeIKernelRecentContactListener/onRecentContactListChangedVer2': {
      const { changedRecentContactLists } =
        payload as OnRecentContactListChangedVer2

      for (const changedRecentContactList of changedRecentContactLists) {
        const { listType, changedList } = changedRecentContactList

        switch (listType) {
          case ContactListType.Normal: {
            for (const contact of changedList)
              if (contact.chatType === ChatType.MsgBox)
                ctx.chronocatEngineChronocatApi.msgBoxActiv.activate({
                  chatType: contact.chatType,
                  peerUid: contact.peerUid,
                  guildId: '',
                })

            break
          }

          case ContactListType.MsgBox: {
            for (const contact of changedList)
              if (contact.chatType === ChatType.Group)
                ctx.chronocatEngineChronocatApi.msgBoxActiv.activate({
                  chatType: contact.chatType,
                  peerUid: contact.peerUid,
                  guildId: '',
                })

            break
          }
        }

        for (const contact of changedList) {
          ctx.chronocat.uix.add(contact.senderUid, contact.senderUin)
          if (contact.chatType === ChatType.Private)
            ctx.chronocat.uix.add(contact.peerUid, contact.peerUin)
        }
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

    case 'nodeIKernelMsgListener/onAddSendMsg': {
      const { msgRecord } = payload as OnAddSendMsg
      // msgRecord.sendStatus === 1, sending
      sendCallbackMap[msgRecord.msgId] = sendQueue.shift()!
      return
    }

    case 'nodeIKernelMsgListener/onMsgInfoListUpdate': {
      const { msgList } = payload as OnMsgInfoListUpdate

      for (const msg of msgList) {
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      for (const msg of msgList) {
        if (msg.sendStatus > 1) {
          sendCallbackMap[msg.msgId]?.(msg)
          delete sendCallbackMap[msg.msgId]
        }
      }

      return
    }
  }
}
