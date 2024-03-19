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

// 定义一个函数`buildHandler`，该函数接收一个`ChronocatContext`类型的上下文对象`ctx`，
// 并返回另一个函数，这个返回的函数用来处理IPC消息（`IpcManData`类型）。
export const buildHandler = (ctx: ChronocatContext) => (data: IpcManData) => {
  // 使用switch语句根据消息的类型来执行不同的逻辑。
  switch (data.type) {
    // 如果消息类型是'event'，表示这是一个事件消息。
    case 'event': {
      // 如果事件消息不包含参数或者第二个参数不是数组，则直接返回不做处理。
      if (!data.args[1] || !Array.isArray(data.args[1])) return
      // 将第二个参数强制类型转换为[RedIpcDataEvent]类型，这是事件数据的数组。
      const d = data.args[1] as [RedIpcDataEvent]
      // 如果数组为空，则直接返回不做处理。
      if (!d.length) return
      // 获取数组中的第一个事件数据。
      const e = d[0]
      // 如果事件数据不存在或者没有'cmdName'属性，则直接返回不做处理。
      if (!e || !('cmdName' in e)) return
      // 使用`dispatcher`函数处理事件，传入上下文、命令名称和负载数据。
      // `void`关键字用于指示这里不关心`dispatcher`函数的返回值。
      void dispatcher(ctx, e.cmdName, e.payload)
      return
    }

    // 如果消息类型是'wrapped-request'，表示这是一个封装的请求消息。
    case 'wrapped-request': {
      // 将请求的ID和方法名映射起来，保存在`requestMethodMap`中，以便之后使用。
      requestMethodMap[data.id] = (data.args[1] as RedIpcDataRequest)[0]
      return
    }

    // 如果消息类型是'wrapped-response'，表示这是一个封装的响应消息。
    case 'wrapped-response': {
      // 通过请求ID获取之前保存的响应回调函数。
      const res = requestCallbackMap[data.id]
      // 如果找到了回调函数，就使用响应数据调用它。
      if (res) res(data.args[1] /* RedIpcDataResponse */)

      // 通过请求ID获取之前保存的请求方法名。
      const method = requestMethodMap[data.id]
      // 如果找到了请求方法名，就使用`dispatcher`函数处理响应，传入上下文、方法名和响应数据。
      // 同时，从`requestMethodMap`中删除该请求ID的记录，因为它已经被处理。
      if (method) {
        delete requestMethodMap[data.id]
        void dispatcher(ctx, method, data.args[1] /* RedIpcDataResponse */)
      }

      return
    }
  }
}

// 定义一个异步函数`dispatcher`，它接收一个上下文对象`ctx`，一个字符串`method`来标识消息类型，以及一个未知类型的`payload`作为载荷。
const dispatcher = async (
  ctx: ChronocatContext,
  method: string,
  payload: unknown,
) => {
  // 使用switch语句根据`method`的值来执行不同的逻辑。
  switch (method) {
    // 如果消息类型是`nodeIKernelMsgListener/onRecvActiveMsg`或`nodeIKernelMsgListener/onRecvMsg`，
    // 表示接收到了新的消息或活跃消息。
    case 'nodeIKernelMsgListener/onRecvActiveMsg':
    case 'nodeIKernelMsgListener/onRecvMsg': {
      // 将`payload`强制类型转换为`OnRecvMsg`类型，然后解构出`msgList`。
      const { msgList } = payload as OnRecvMsg

      // 遍历`msgList`中的每个消息。
      for (const msg of msgList) {
        // 使用消息的发送者UID和UIN向UIX添加记录。
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        // 如果消息类型是私聊（`ChatType.Private`），则同样向UIX添加接收者的UID和UIN。
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      // 没有返回值，因为只是处理消息。
      return
    }

    // 如果消息类型是`nodeIKernelMsgListener/onRichMediaDownloadComplete`，
    // 表示富媒体消息下载完成。
    case 'nodeIKernelMsgListener/onRichMediaDownloadComplete': {
      // 将`payload`强制类型转换为`OnRichMediaDownloadComplete`类型，然后解构出`notifyInfo`。
      const { notifyInfo } = payload as OnRichMediaDownloadComplete

      // 构造一个下载ID，由消息ID和消息元素ID组成。
      const downloadId = `${notifyInfo.msgId}::${notifyInfo.msgElementId}`

      // 如果文件下载类型是1（表示某种特定类型的下载），并且在`richMediaDownloadMap`中找到了对应的下载ID，
      // 则调用与该下载ID相关联的回调函数，传入文件路径，然后从`richMediaDownloadMap`中删除该下载ID的记录。
      if (notifyInfo.fileDownType === 1 && richMediaDownloadMap[downloadId]) {
        richMediaDownloadMap[downloadId]!(notifyInfo.filePath)
        delete richMediaDownloadMap[downloadId]
      }

      // 没有返回值，因为只是处理消息。
      return
    }

    // 处理用户个人资料变更或群组成员搜索/列表变更的消息。
    case 'nodeIKernelProfileListener/onProfileSimpleChanged':
    case 'nodeIKernelProfileListener/onProfileDetailInfoChanged':
    case 'nodeIKernelGroupListener/onSearchMemberChange':
    case 'nodeIKernelGroupService/getNextMemberList': {
      // 此行代码被注释掉了，但其目的是获取当前用户的认证数据。
      // const authData = await ctx.chronocat.getAuthData()

      // 将payload强制类型转换为OnProfileChanged类型，然后解构出profiles和infos。
      const { profiles, infos } = payload as OnProfileChanged

      // 此部分代码被注释掉了，但其目的是检查当前用户的个人资料是否在变更中，如果是，则更新selfProfile的值。
      // if (profiles.get(authData.uid))
      //   selfProfile.value = profiles.get(authData.uid)

      // 根据消息类型，可能会收到profiles或infos，或者两者都有。
      // 这里选择profiles或infos中存在的一个来遍历。
      const profile = profiles ?? infos
      // 遍历profiles或infos，每个元素是一个[uid, { uin }]的键值对。
      for (const [uid, { uin }] of profile) {
        // 对每个uid和uin，使用ctx.chronocat.uix.add方法添加到UIX中。
        ctx.chronocat.uix.add(uid, uin)
      }

      // 没有返回值，因为此处仅处理消息。
      return
    }

    // 当某个群组成员的信息发生变化时处理。
    case 'nodeIKernelGroupListener/onMemberInfoChange': {
      // 从payload中解构出members，payload被强制类型转换为OnMemberInfoChange类型。
      const { members } = payload as OnMemberInfoChange

      // 遍历members，每个成员都是一个包含uid和uin的对象。
      for (const [uid, { uin }] of members) {
        // 使用ctx.chronocat.uix.add方法为每个成员添加或更新UIX中的信息。
        ctx.chronocat.uix.add(uid, uin)
      }
      // 处理完成后返回，不需要额外操作。
      return
    }

    // 当群组的成员列表发生变化时处理。
    case 'nodeIKernelGroupListener/onMemberListChange': {
      // 从payload中解构出info，payload被强制类型转换为OnMemberListChange类型。
      const { info } = payload as OnMemberListChange

      // 从info的sceneId字段中提取出groupCode。sceneId通常包含群组ID和其他信息，以'_'分隔。
      const groupCode = info.sceneId.split('_')[0]
      // 如果没有groupCode，则直接返回，不做处理。
      if (!groupCode) return

      // 遍历info.infos，每个成员都是一个包含uid和uin的对象。
      for (const [uid, { uin }] of info.infos) {
        // 使用ctx.chronocat.uix.add方法为每个成员添加或更新UIX中的信息。
        ctx.chronocat.uix.add(uid, uin)
      }
      // 处理完成后返回，不需要额外操作。
      return
    }

    // 处理群组列表更新的消息。这可能是由于新群组的添加、现有群组的移除或群组信息的更新触发。
    case 'onGroupListUpdate':
    case 'nodeIKernelGroupListener/onGroupListUpdate': {
      // 从payload中解构出groupList，payload被强制类型转换为OnGroupListUpdate类型。
      const { groupList } = payload as OnGroupListUpdate

      // 遍历groupList中的每个群组。
      for (const group of groupList) {
        // 使用群组的groupCode作为键，将整个群组对象保存到groupMap中。
        // 这样做可以方便地通过groupCode访问或更新群组信息。
        groupMap[group.groupCode] = group
      }

      // 调用chronoEventEmitter的emitGroupListUpdate方法，通知所有监听者群组列表已更新。
      // 这对于实现响应式UI或执行与群组列表更新相关的其他逻辑操作很有用。
      chronoEventEmitter.emitGroupListUpdate()

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 处理好友列表变化的消息。这可能是由于新好友的添加、现有好友的移除或好友信息的更新触发。
    case 'onBuddyListChange':
    case 'nodeIKernelBuddyListener/onBuddyListChange': {
      // 从payload中解构出data，payload被强制类型转换为OnBuddyListChange类型。
      const { data } = payload as OnBuddyListChange

      // 遍历data中的每个分类。
      for (const category of data) {
        // 在每个分类中，再遍历该分类下的所有好友。
        for (const buddy of category.buddyList) {
          // 使用ctx.chronocat.uix.add方法为每个好友添加或更新UIX中的信息。
          ctx.chronocat.uix.add(buddy.uid, buddy.uin)

          // 将每个好友的categoryName属性注释掉，可能是因为这个信息暂时不需要，或者是将来用于其他用途。
          // buddy.category = category.categoryName

          // 使用好友的uin作为键，将整个好友对象保存到friendMap中。
          // 这样做可以方便地通过uin访问或更新好友信息。
          friendMap[buddy.uin] = buddy
        }
      }

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 当请求包括发送者本人的消息列表时处理。
    case 'nodeIKernelMsgService/getMsgsIncludeSelf': {
      // 从payload中解构出msgList，payload被强制类型转换为MsgsIncludeSelf类型。
      const { msgList } = payload as MsgsIncludeSelf

      // 遍历msgList中的每条消息。
      for (const msg of msgList) {
        // 使用ctx.chronocat.uix.add方法为消息的发送者添加或更新UIX中的信息。
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        // 如果消息类型是私聊（ChatType.Private），则也为消息的接收者添加或更新UIX中的信息。
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 当最近联系人列表发生变化时处理。
    case 'nodeIKernelRecentContactListener/onFirstScreenRecentContactListChanged': {
      // 从payload中解构出changedList，payload被强制类型转换为ContactList类型。
      const { changedList } = payload as ContactList

      // 此处有一段被注释的代码，看起来是用于处理不同类型的联系人列表变化，
      // 特别是MsgBox类型的列表变化，但目前只有一个案例被展示。
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

      // 遍历changedList中的每个联系人。
      for (const contact of changedList) {
        // 使用ctx.chronocat.uix.add方法为联系人的发送者添加或更新UIX中的信息。
        ctx.chronocat.uix.add(contact.senderUid, contact.senderUin)
        // 如果联系人类型是私聊（ChatType.Private），则也为对应的接收者添加或更新UIX中的信息。
        if (contact.chatType === ChatType.Private)
          ctx.chronocat.uix.add(contact.peerUid, contact.peerUin)
      }

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 当最近联系人列表版本2发生变化时处理。
    case 'nodeIKernelRecentContactListener/onRecentContactListChangedVer2': {
      // 从payload中解构出changedRecentContactLists，payload被强制类型转换为OnRecentContactListChangedVer2类型。
      const { changedRecentContactLists } =
        payload as OnRecentContactListChangedVer2

      // 遍历所有变更的联系人列表。
      for (const changedRecentContactList of changedRecentContactLists) {
        // 对每个变更的列表，解构出列表类型和变更的联系人列表。
        const { listType, changedList } = changedRecentContactList

        // 根据列表类型进行不同的处理。
        switch (listType) {
          // 以下代码被注释掉，原意是处理常规类型的联系人列表变更，
          // 特别是针对消息盒子中的聊天类型。
          // case ContactListType.Normal: {
          //   for (const contact of changedList)
          //     if (contact.chatType === ChatType.MsgBox)
          //       ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(contact.peerUid)
          //   break
          // }

          // 如果列表类型是消息盒子类型。
          case ContactListType.MsgBox: {
            // 遍历变更的联系人列表。
            for (const contact of changedList)
              if (contact.chatType === ChatType.Group)
                // 如果联系人的聊天类型是群组，激活对应的消息盒子。
                ctx.chronocatEngineChronocatApi.msgBoxActiv.activate(
                  contact.peerUid,
                )
            break
          }
        }

        // 独立于列表类型的处理，对所有变更的联系人进行遍历。
        for (const contact of changedList) {
          // 更新或添加联系人的发送者UID和UIN到UIX中。
          ctx.chronocat.uix.add(contact.senderUid, contact.senderUin)
          // 如果联系人类型是私聊，同样更新或添加接收者的UID和UIN。
          if (contact.chatType === ChatType.Private)
            ctx.chronocat.uix.add(contact.peerUid, contact.peerUin)
        }
      }

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 当打开参数发生变化时处理。
    case 'onOpenParamChange': {
      // 从payload中解构出data，payload被强制类型转换为OnOpenParamChange类型。
      const { data } = payload as OnOpenParamChange

      // 遍历data中的每个联系人。
      for (const contact of data) {
        // 使用ctx.chronocat.uix.add方法为联系人的发送者添加或更新UIX中的信息。
        ctx.chronocat.uix.add(contact.senderUid, contact.senderUin)
        // 如果联系人类型是私聊（ChatType.Private），则也为对应的接收者添加或更新UIX中的信息。
        if (contact.chatType === ChatType.Private)
          ctx.chronocat.uix.add(contact.peerUid, contact.peerUin)
      }

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 当添加发送消息时处理。
    case 'nodeIKernelMsgListener/onAddSendMsg': {
      // 从payload中解构出msgRecord，payload被强制类型转换为OnAddSendMsg类型。
      const { msgRecord } = payload as OnAddSendMsg
      // 如果msgRecord的sendStatus为1（发送中），则处理发送回调。
      // sendCallbackMap是一个保存消息ID与发送回调函数映射的对象。
      // sendQueue是一个队列，保存了待发送消息的回调函数。
      sendCallbackMap[msgRecord.msgId] = sendQueue.shift()!

      // 操作完成后返回，不需要额外操作。
      return
    }

    // 当消息信息列表发生更新时处理。
    case 'nodeIKernelMsgListener/onMsgInfoListUpdate': {
      // 从payload中解构出msgList，payload被强制类型转换为OnMsgInfoListUpdate类型。
      const { msgList } = payload as OnMsgInfoListUpdate

      // 第一次遍历msgList是为了更新或添加消息发送者和接收者（如果是私聊）的UIX信息。
      for (const msg of msgList) {
        // 更新或添加消息发送者的UIX信息。
        ctx.chronocat.uix.add(msg.senderUid, msg.senderUin)
        // 如果消息是私聊，也更新或添加消息接收者的UIX信息。
        if (msg.chatType === ChatType.Private)
          ctx.chronocat.uix.add(msg.peerUid, msg.peerUin)
      }

      // 第二次遍历msgList是为了处理发送状态。
      // 如果消息的发送状态大于1（例如，发送成功或发送失败），则执行相应的回调函数。
      for (const msg of msgList) {
        if (msg.sendStatus > 1) {
          // 如果sendCallbackMap中存在对应消息ID的回调函数，则执行该回调函数，并传入消息对象。
          sendCallbackMap[msg.msgId]?.(msg)
          // 执行完回调函数后，从sendCallbackMap中删除对应的消息ID记录。
          delete sendCallbackMap[msg.msgId]
        }
      }

      // 操作完成后返回，不需要额外操作。
      return
    }
  }
}
