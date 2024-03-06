import type {
  MsgsIncludeSelf,
  OnAddSendMsg,
  OnBuddyListChange,
  OnGroupListUpdate,
  OnMemberInfoChange,
  OnMemberListChange,
  OnMsgInfoListUpdate,
  OnProfileChanged,
  OnRecentContactListChangedVer2,
  OnRecvMsg,
  OnRichMediaDownloadComplete,
  RedIpcArgs,
  RedIpcDataEvent,
  RedIpcDataRequest,
} from '@chronocat/red'
import { ChatType } from '@chronocat/red'
import type { ChronocatContext } from '@chronocat/shell'
import type { IpcManData } from 'ipcman'
import { ipcMan } from 'ipcman'
import { buildAssetsGet } from './api/internal/assets/get'
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
import { buildMessageCreate } from './api/message/create'

declare const __DEFINE_CHRONO_VERSION__: string

export const name = 'engine-chronocat-api'
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

      case 'nodeIKernelMsgListener/onAddSendMsg': {
        const { msgRecord } = payload as OnAddSendMsg
        // msgRecord.sendStatus === 1, sending
        sendCallbackMap[msgRecord.msgId] = sendQueue.shift()!
        return
      }

      case 'nodeIKernelMsgListener/onMsgInfoListUpdate': {
        const { msgList } = payload as OnMsgInfoListUpdate
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
        const res = requestCallbackMap[data.id]
        if (res) res(data.args[1] /* RedIpcDataResponse */)

        const method = requestMethodMap[data.id]
        if (method) {
          delete requestMethodMap[data.id]
          void dispatcher(method, data.args[1] /* RedIpcDataResponse */)
        }

        return
      }
    }
  }

  ipcMan<RedIpcArgs>({
    handler,
    getId: (p) => p?.[0]?.callbackId,
  })

  const register = ctx.chronocat.api.register(name)
  register('chronocat.internal.assets.get', buildAssetsGet(ctx))
  register('message.create', buildMessageCreate(ctx))
  register('chronocat.internal.message.create.forward', buildMessageCreate(ctx))

  await ctx.chronocat.whenReady()
}
