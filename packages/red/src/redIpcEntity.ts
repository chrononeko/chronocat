import type {
  Contact,
  ContactList,
  Group,
  Member,
  Profile,
  RedMessage,
} from './redEntity'

export interface Result {
  result: number
  errMsg: string
}

export interface OnRecvMsg {
  msgList: RedMessage[]
}

export interface OnProfileChanged {
  profiles: [
    string,
    {
      uin: string
    },
  ][] & {
    get: (uid: string) => Profile
  }

  infos: [
    string,
    {
      uin: string
    },
  ][]

  info: Profile
}

export interface OnMemberInfoChange {
  groupCode: string
  dataSource: number
  members: [
    string,
    {
      uin: string
      role: number
    },
  ][] & {
    get: (uid: string) => Member
  }
}

export interface OnMemberListChange {
  info: {
    sceneId: string
    ids: unknown[]
    infos: [
      string,
      {
        uin: string
        role: number
      },
    ][] & {
      get: (uid: string) => Member
    }
  }
}

export interface OnRichMediaDownloadComplete {
  notifyInfo: {
    /**
     * 下载富媒体的类型。1 为原图，2 为缩略图。
     */
    fileDownType: 1 | 2
    msgId: string
    msgElementId: string
    filePath: string
  }
}

export interface OnEmojiDownloadComplete {
  notifyInfo: {
    result: 0
    errMsg: string // ''
    emojiType: 0
    md5: string // ''
    resId: string // ''
    path: string
    extraData: Record<string, never>
    emojiId: string // '94c8ffa6977fd17e8b180b312cdddc28'
    emojiPackageId: string // '235125'

    /**
     * 下载富媒体的类型。发送时 3 为 PNG，4 为动图；接收时 0 为 PNG，4 为动图。
     */
    downloadType: 0 | 4

    dynamicFacePath: string // ''
  }
}

export interface OnGroupListUpdate {
  updateType: 1
  groupList: Group[]
}

export interface OnBuddyListChange {
  /**
   * 好友分组列表。
   */
  data: {
    /**
     * 好友分组 ID。
     */
    categoryId: number

    /**
     * 好友分组名称。
     */
    categoryName: string

    /**
     * 分组内好友个数。
     */
    categroyMbCount: number

    /**
     * 分组内好友列表。
     */
    buddyList: Profile[]
  }[]
}

export interface OnAddSendMsg {
  msgRecord: RedMessage
}

export interface OnMsgInfoListUpdate {
  msgList: RedMessage[]
}

export interface BuddyReq {
  isDecide: boolean
  isInitiator: boolean
  friendUid: string
  reqType: number
  reqSubType: number
  reqTime: string //'1700000000'
  extWords: string // 验证消息
  flag: number
  preGroupingId: number
  commFriendNum: number
  curFriendMax: number
  isShowCard: boolean
  isUnread: boolean
  isDoubt: boolean
  nameMore: ''
  friendNick: string // 用户名
  friendAvatarUrl: ''
  sourceId: number
  groupCode: string
  isBuddy: unknown
  isAgreed: boolean
  relation: number
}

export interface OnBuddyReqChange {
  unreadNums: number
  buddyReqs: BuddyReq[]
}

export interface OnRecentContactListChangedVer2 {
  changedRecentContactLists: ContactList[]
  seq: number
}

export interface MsgsIncludeSelf {
  result: 0
  errMsg: ''
  msgList: RedMessage[]
}

export interface OnOpenParamChange {
  data: Contact[]
}

export interface OnGroupNotifiesUnreadCountUpdated {
  /**
   * 是否有过滤消息
   */
  doubt: boolean

  /**
   * 最旧未读消息 ID
   */
  oldestUnreadSeq: string // '1716209619000000'

  /**
   *
   * 未读消息数
   */
  unreadCount: number
}

export interface OnGroupSingleScreenNotifies {
  /**
   * 是否是过滤消息列表
   */
  doubt: false

  /**
   * 分页 ID
   */
  nextStartSeq: '0'

  notifies: GroupNotify[]
}

export interface GroupNotify {
  seq: string // '1716209619000000'

  type: number // 7

  status: number // 1

  group: {
    groupCode: string
    groupName: string
  }

  user1: {
    uid: string
    nickName: string
  }

  user2: {
    uid: string
    nickName: string
  }

  actionUser: {
    uid: string
    nickName: string
  }

  actionTime: string // '0'

  invitationExt: {
    srcType: number // 0
    groupCode: string // '0'
    waitStatus: number // 0
  }

  /**
   * 验证消息
   */
  postscript: string

  repeatSeqs: []

  warningTips: string // '该账号存在风险，请谨慎操作'
}
