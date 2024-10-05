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

export interface OnProfileSimpleChanged {
  profiles: Record<string, UserSimpleInfo>
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
  /**
   * 1 为增加，3 为退出。
   */
  updateType: 1 | 3

  groupList: Group[]
}

export interface OnBuddyListChange {
  /**
   * 好友分组列表。
   */
  data: BuddyListChangeData[] | undefined

  /**
   * 好友分组列表。
   */
  buddyCategory: BuddyCategory[] | undefined

  /**
   * 用户信息，键为 uid。
   */
  userSimpleInfos: Record<string, UserSimpleInfo> | undefined
}

export interface BuddyListChangeData {
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
}

export interface BuddyCategory {
  categoryId: number

  /**
   * 数值越小，显示越在上方
   */
  categorySortId: number

  categroyName: string

  categroyMbCount: number

  onlineCount: number

  buddyUids: string[]
}

export interface UserSimpleInfo {
  uid: string
  uin: string
  coreInfo: UserCoreInfo
  baseInfo: UserBaseInfo
  status: UserStatus | null
  vasInfo: UserVasInfo | null
  relationFlags: UserRelationFlags
  otherFlags: unknown
  intimate: unknown
}

export interface UserCoreInfo {
  uid: string
  uin: string
  nick: string

  /**
   * 无情况下为空字符串
   */
  remark: string
}

export interface UserBaseInfo {
  /**
   * 无情况下为空字符串
   */
  qid: string

  /**
   * 无情况下为空字符串
   */
  longNick: string

  /**
   * 不显示情况下为 0
   */
  birthday_year: number

  /**
   * 不显示情况下为 0
   */
  birthday_month: number

  /**
   * 不显示情况下为 0
   */
  birthday_day: number
  age: number
  sex: number
  eMail: string
  phoneNum: string
  categoryId: number
  richTime: number
  richBuffer: unknown
}

export interface UserStatus {
  uid: string
  uin: string
  status: number
  extStatus: number
  batteryStatus: number
  termType: number
  netType: number
  iconType: number
  customStatus: {
    faceId: string
    faceType: string
    wording: string
  }
  setTime: string
  specialFlag: number
  abiFlag: number
  eNetworkType: number
  showName: string
  termDesc: string
  musicInfo: {
    buf: unknown
  }
  extOnlineBusinessInfo: {
    buf: unknown
    customStatus: unknown
    videoBizInfo: {
      cid: string
      tvUrl: string
      synchType: string
    }
    videoInfo: {
      name: string
    }
  }
  extBuffer: {
    buf: unknown
  }
}

export interface UserVasInfo {
  /**
   * 是否为 VIP
   */
  vipFlag: boolean

  /**
   * 是否为年费 VIP
   */
  yearVipFlag: boolean

  /**
   * 是否为 SVIP
   */
  svipFlag: boolean

  /**
   * VIP 等级
   */
  vipLevel: number

  /**
   * 是否为大会员
   */
  bigClub: boolean

  /**
   * 大会员等级
   */
  bigClubLevel: number

  nameplateVipType: number
  grayNameplateFlag: number
  superVipTemplateId: number
  diyFontId: number
  pendantId: number
  pendantDiyId: number
  faceId: number
  vipFont: number
  vipFontType: number
  magicFont: number
  fontEffect: number
  newLoverDiamondFlag: number
  extendNameplateId: number
  diyNameplateIDs: unknown[]
  vipStartFlag: number
  vipDataFlag: number
  gameNameplateId: string
  gameLastLoginTime: string
  gameRank: number
  gameIconShowFlag: boolean
  gameCardId: string

  /**
   * VIP 昵称颜色类型
   */
  vipNameColorId: string

  privilegeIcon: null
}

export interface UserRelationFlags {
  topTime: string
  isBlock: boolean
  isMsgDisturb: boolean
  isSpecialCareOpen: boolean
  isSpecialCareZone: boolean
  ringId: string
  isBlocked: boolean
  recommendImgFlag: number
  disableEmojiShortCuts: number
  qidianMasterFlag: number
  qidianCrewFlag: number
  qidianCrewFlag2: number
  isHideQQLevel: number
  isHidePrivilegeIcon: number
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

export type GroupNotify =
  | GroupNotifyGuildRequest
  | GroupNotifyGuildMemberRequest
  | GroupNotifyGuildMemberRemoved
  | GroupNotifyGuildSetAdmin

export interface GroupNotifyBase {
  seq: string // '1716209619000000'

  group: {
    groupCode: string
    groupName: string
  }

  actionTime: string // '0'，status 变 2/3 以后有值

  invitationExt: {
    srcType: number // 0
    groupCode: string // '0'

    /**
     * 2：管理员已同意
     */
    waitStatus: 0 | 2
  }

  /**
   * 验证消息
   */
  postscript: string

  repeatSeqs: string[]

  warningTips: string // '该账号存在风险，请谨慎操作'
}

export interface GroupNotifyGuildRequest extends GroupNotifyBase {
  /**
   * guild-request 事件
   */
  type: 1

  /**
   * 1：等待操作
   * 2：已同意
   * 3：已拒绝
   */
  status: 1 | 2 | 3

  /**
   * 自身，可忽略该字段
   */
  user1: {
    uid: string
    nickName: string
  }

  /**
   * 邀请自身进群的人
   */
  user2: {
    uid: string
    nickName: string
  }

  /**
   * 自身，可忽略该字段
   */
  actionUser: {
    uid: string
    nickName: string
  }
}

export interface GroupNotifyGuildMemberRequest extends GroupNotifyBase {
  /**
   * guild-member-request 事件
   */
  type: 7

  /**
   * 1：等待操作
   * 2：已同意
   * 3：已拒绝
   */
  status: 1 | 2 | 3

  /**
   * 申请进群的人
   */
  user1: {
    uid: string
    nickName: string
  }

  /**
   * 值始终为空
   */
  user2: {
    uid: ''
    nickName: ''
  }

  /**
   * 处理的管理员
   */
  actionUser: {
    uid: string
    nickName: string
  }
}

export interface GroupNotifyGuildMemberRemoved extends GroupNotifyBase {
  /**
   * guild-member-removed 事件
   */
  type: 11

  /**
   * 无需任何操作
   */
  status: 0

  /**
   * 退群的用户
   */
  user1: {
    uid: string
    nickName: string
  }

  /**
   * 值始终为空
   */
  user2: {
    uid: ''
    nickName: ''
  }

  /**
   * 值始终为空
   */
  actionUser: {
    uid: ''
    nickName: ''
  }
}

export interface GroupNotifyGuildSetAdmin extends GroupNotifyBase {
  /**
   * 群主将某群员设置为管理员
   */
  type: 8

  /**
   * 无需任何操作
   */
  status: 0

  /**
   * 自身，可忽略该字段
   */
  user1: {
    uid: string
    nickName: string
  }

  /**
   * 将自身设置为管理员的人（群主）
   */
  user2: {
    uid: string
    nickName: string
  }

  /**
   * 值始终为空
   */
  actionUser: {
    uid: ''
    nickName: ''
  }
}
