import type { Element, Peer, RedMessage } from '@chronocat/red'
import type { O } from 'ts-toolbelt'
import { define } from '../invoke'

export const recallMsg = define<
  unknown,
  [
    {
      peer: Peer
      msgIds: string[]
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/recallMsg')

export const downloadRichMedia = define<
  unknown,
  [
    {
      getReq: {
        msgId: string
        chatType: number
        peerUid: string
        elementId: string
        thumbSize: number
        downloadType: number
      }
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/downloadRichMedia')

export const getMsgsIncludeSelf = define<
  object,
  [
    {
      peer: Peer
      msgId: string
      cnt: number
      queryOrder: boolean
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/getMsgsIncludeSelf')

export const getRichMediaFilePath = define<
  string,
  [
    {
      md5HexStr: string
      fileName: string
      elementType: number
      elementSubType: number
      thumbSize: number
      needCreate: boolean
      fileType: number
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/getRichMediaFilePath')

export const getRichMediaFilePathForGuild = define<
  string,
  [
    {
      path_info: {
        md5HexStr: string
        fileName: string
        elementType: number
        elementSubType: number
        thumbSize: number
        needCreate: boolean
        fileType: number
        downloadType: number
        file_uuid: string
      }
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/getRichMediaFilePathForGuild')

export const sendMsg = define<
  unknown,
  [
    {
      msgId: '0'
      peer: Peer
      msgElements: O.Partial<Element, 'deep'>[]
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/sendMsg')

export const multiForwardMsgWithComment = define<
  unknown,
  [
    {
      msgInfos: {
        msgId: string
        senderShowName: string
      }[]
      srcContact: Peer
      dstContact: Peer
      commentElements: []
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/multiForwardMsgWithComment')

export const getEmojiResourcePath = define<
  {
    result: 0
    errMsg: 'success'
    resourcePath: string
  },
  [
    {
      type: 0 | 1 | 2 | 3 | 4
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/getEmojiResourcePath')

export const getAioFirstViewLatestMsgsAndAddActiveChat = define<
  {
    result: 0
    errMsg: 'success'
    msgList: RedMessage[]
    needContinueGetMsg: boolean
  },
  [
    {
      peer: Peer
      cnt: number // 20
    },
  ]
>(
  'ns-ntApi-2',
  'nodeIKernelMsgService/getAioFirstViewLatestMsgsAndAddActiveChat',
)

export const getMsgsIncludeSelfAndAddActiveChat = define<
  {
    result: 0
    errMsg: 'success'
    msgList: RedMessage[]
  },
  [
    {
      peer: Peer
      msgId: string // '0'
      cnt: number // 20
      queryOrder: boolean // true
    },
  ]
>('ns-ntApi-2', 'nodeIKernelMsgService/getMsgsIncludeSelfAndAddActiveChat')

export const deleteActiveChatByUid = define<Record<string, never>, [string]>(
  'ns-ntApi-2',
  'nodeIKernelMsgService/deleteActiveChatByUid',
)
