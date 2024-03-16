import type {
  ContactList,
  MsgsIncludeSelf,
  OnAddSendMsg,
  OnBuddyListChange,
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
      void dispatcher(ctx, e.cmdName, e.payload)
      return
    }

    case 'wrapped-request': {
      requestMethodMap[data.id] = (data.args[1] as RedIpcDataRequest)[0]
      return
    }

    case 'wrapped-response': {
      const res = requestCallbackMap[data.id]
      if (res) res(data.args[1] /* RedIpcDataResponse */)

      const method = requestMethodMap[data.id]
      if (method) {
        delete requestMethodMap[data.id]
        void dispatcher(ctx, method, data.args[1] /* RedIpcDataResponse */)
      }

      return
    }
  }
}

const dispatcher = async (
  ctx: ChronocatContext,
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

      for (const group of groupList) groupMap[group.groupCode] = group

      chronoEventEmitter.emitGroupListUpdate()

      return
    }

    case 'onBuddyListChange':
    case 'nodeIKernelBuddyListener/onBuddyListChange': {
      const { data } = payload as OnBuddyListChange

      for (const category of data) {
        for (const buddy of category.buddyList) {
          ctx.chronocat.uix.add(buddy.uid, buddy.uin)

          // buddy.category = category.categoryName
          friendMap[buddy.uin] = buddy
        }
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
          // case ContactListType.Normal: {
          //   for (const contact of changedList)
          //     if (contact.chatType === ChatType.MsgBox)
          //       ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(
          //         contact.peerUid,
          //       )

          //   break
          // }

          case ContactListType.MsgBox: {
            for (const contact of changedList)
              if (contact.chatType === ChatType.Group)
                ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(
                  contact.peerUid,
                )

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
