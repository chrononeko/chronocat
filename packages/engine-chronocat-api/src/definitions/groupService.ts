import type { Result } from '@chronocat/red'
import { define } from '../invoke'

export type SceneId = unknown

export const getMemberInfo = define<
  unknown,
  [
    {
      forceUpdate: boolean
      groupCode: string
      uids: string[]
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/getMemberInfo')

export const getGroupDetailInfo = define<
  Result,
  [
    {
      groupCode: string
      source: 4
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/getGroupDetailInfo')

export const createMemberListScene = define<
  SceneId,
  [
    {
      groupCode: number
      scene: 'groupMemberList_MainWindow'
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/createMemberListScene')

export const searchMember = define<
  undefined,
  [
    {
      sceneId: SceneId
      keyword: string
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/searchMember')

export const destroyMemberListScene = define<
  undefined,
  [
    {
      sceneId: SceneId
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/destroyMemberListScene')

export interface MemberListResult {
  result: {
    ids: {
      uid: string
      index: string
    }[]
    infos: {
      get: (uid: string) =>
        | {
            uid: string
            qid: ''
            uin: string
            nick: string
            remark: string
            cardType: 0
            cardName: string
            role: number
            avatarPath: string
            shutUpTime: number
            isDelete: boolean
            isSpecialConcerned: boolean
          }
        | undefined
    }
  }
}

export const getNextMemberList = define<
  MemberListResult,
  [
    {
      sceneId: SceneId
      lastId: undefined
      num: number
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/getNextMemberList')

export const setMemberShutUp = define<
  unknown,
  [
    {
      groupCode: string
      memList: {
        uin?: string
        uid?: string
        timeStamp: number
      }[]
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/setMemberShutUp')

export const setGroupShutUp = define<
  unknown,
  [
    {
      groupCode: string
      shutUp: boolean
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/setGroupShutUp')

export const kickMember = define<
  unknown,
  [
    {
      groupCode: string
      kickUids: string[]
      refuseForever: boolean
      kickReason: string
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/kickMember')

export const quitGroup = define<
  {
    result: number
    errMsg: string
  },
  [
    {
      groupCode: string
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/quitGroup')

export const getSingleScreenNotifies = define<
  unknown,
  [
    {
      doubt: boolean
      startSeq: string // '1716209619000000'
      number: number // 16
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/getSingleScreenNotifies')

export const operateSysNotify = define<
  unknown,
  [
    {
      doubt: false
      operateMsg: {
        operateType: 1
        targetMsg: {
          seq: ''
          type: 1
          groupCode: string
          postscript: ''
        }
      }
    },
  ]
>('ns-ntApi-2', 'nodeIKernelGroupService/operateSysNotify')
