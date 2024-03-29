export interface Profile {
  uid: string
  qid: string
  uin: string
  nick: string
  remark: string
  longNick: string
  avatarUrl: string
  birthday_year: number
  birthday_month: number
  birthday_day: number
  sex: number
  topTime: string
  isBlock: boolean
  isMsgDisturb: boolean
  isSpecialCareOpen: boolean
  isSpecialCareZone: boolean
  ringId: string
  status: number
  extStatus: number
  categoryId: number
  onlyChat: boolean
  qzoneNotWatch: boolean
  qzoneNotWatched: boolean
  vipFlag: boolean
  yearVipFlag: boolean
  svipFlag: boolean
  vipLevel: number

  // 以下为 >9.9.1 添加
  qidianMasterFlag: number
  qidianCrewFlag: number
  qidianCrewFlag2: number
  isZPlanCoupleOpen: boolean
  zplanCoupleSceneId: number
  teenagerFlag: number
  studyFlag: number
}

export interface Member {
  uid: string
  qid: string
  uin: string
  nick: string
  remark: string
  cardType: number
  cardName: string
  role: number
  avatarPath: string
  shutUpTime: number
  isDelete: boolean
}

export interface Peer {
  chatType: ChatType
  peerUid: string
  guildId?: string
}

export interface Group {
  /**
   * {@link String} 形式的群号
   */
  groupCode: string

  /**
   * 最大人数
   */
  maxMember: number

  /**
   * 当前人数
   */
  memberCount: number

  /**
   * 群名称
   */
  groupName: string

  groupStatus: 0

  /**
   * 我在群里的身份，2 普通群员，3 管理员
   */
  memberRole: 2 | 3

  /**
   * 是否置顶
   */
  isTop: boolean

  /**
   * 置顶时间
   */
  toppedTimestamp: string

  /**
   * 权限 flag
   */
  privilegeFlag: number

  isConf: boolean

  /**
   * 是否已修改群头像
   */
  hasModifyConfGroupFace: boolean

  /**
   * 是否已修改群名称
   */
  hasModifyConfGroupName: boolean

  /**
   * 群备注名
   */
  remarkName: string

  avatarUrl?: string

  hasMemo: boolean
  groupShutupExpireTime: string
  personShutupExpireTime: string

  discussToGroupUin: string
  discussToGroupMaxMsgSeq: number
  discussToGroupTime: number

  // 以下为 >9.9.1 添加

  groupFlagExt: number
  authGroupType: number
  groupCreditLevel: number
  groupFlagExt3: number

  groupOwnerId: {
    memberUin: '0'

    /**
     * 不一定存在，勿使用
     */
    memberUid: ''
  }
}

export enum ChatType {
  Private = 1,
  Group = 2,
  Guild = 4,
  MsgBox = 7,
}

export enum MsgType {
  /**
   * 不在前端显示的消息。
   *
   * 例：群内消息提醒设置：不接收此人消息
   */
  Value1 = 1,

  /**
   * 普通消息。
   */
  Normal = 2,

  Value3 = 3,

  /**
   * 系统通知。
   */
  System = 5,

  /**
   * 语音消息。
   */
  Ptt = 6,

  /**
   * 视频消息。
   */
  Video = 7,

  Value8 = 8,

  /**
   * 带 Quote 消息。
   */
  WithRecords = 9,

  /**
   * 红包消息。
   */
  Wallet = 10,

  /**
   * 卡片消息。
   */
  Ark = 11,

  Vaule17 = 17,
}

export enum SendType {
  Normal = 0,
  System = 3,
}

export interface RedMessage {
  msgId: string
  msgRandom: string
  msgSeq: string
  cntSeq: string
  chatType: ChatType
  msgType: MsgType
  subMsgType: number
  sendType: SendType
  senderUid: string
  peerUid: string
  channelId: string
  guildId: string
  guildCode: string
  fromUid: string
  fromAppid: string
  msgTime: string
  msgMeta: string
  sendStatus: number
  sendMemberName: string
  sendNickName: string
  guildName: string
  channelName: string
  elements: Element[]
  records: RedMessage[]
  emojiLikesList: unknown[]
  commentCnt: string
  directMsgFlag: number
  directMsgMembers: unknown[]
  peerName: string
  editable: boolean
  avatarMeta: string
  avatarPendant: string
  feedId: string
  roleId: string
  timeStamp: string
  isImportMsg: boolean
  atType: AtType
  roleType: number
  fromChannelRoleInfo: RoleInfo
  fromGuildRoleInfo: RoleInfo
  levelRoleInfo: RoleInfo
  recallTime: string
  isOnlineMsg: boolean
  generalFlags: string
  clientSeq: string
  nameType: number
  avatarFlag: number

  senderUin: string
  peerUin: string
}

export interface Element {
  elementType: number
  elementId: string
  extBufForUI: string
  picElement?: PicElement
  textElement?: TextElement
  arkElement?: ArkElement
  avRecordElement?: unknown
  calendarElement?: unknown
  faceElement?: FaceElement
  fileElement?: FileElement
  giphyElement?: unknown
  grayTipElement?: GrayTipElement
  inlineKeyboardElement?: unknown
  liveGiftElement?: unknown
  markdownElement?: unknown
  marketFaceElement?: unknown
  multiForwardMsgElement?: unknown
  pttElement?: PttElement
  replyElement?: ReplyElement
  structLongMsgElement?: unknown
  textGiftElement?: unknown
  videoElement?: VideoElement
  walletElement?: unknown
  yoloGameResultElement?: unknown
  structMsgElement: unknown
  faceBubbleElement: unknown
  shareLocationElement: unknown
  tofuRecordElement: unknown
  taskTopMsgElement: unknown
}

export interface PicElement {
  picSubType: number
  fileName: string
  fileSize: string
  picWidth: number
  picHeight: number
  original: boolean
  md5HexStr: string
  sourcePath: string
  thumbPath: ThumbPath
  transferStatus: number
  progress: number
  picType: number
  invalidState: number
  fileUuid: string
  fileSubId: string
  thumbFileSize: number
  summary: string
  emojiAd: EmojiAd
  emojiMall: EmojiMall
  emojiZplan: EmojiZplan
}

export interface FaceElement {
  faceIndex: number
  faceText: string
  faceType: FaceType
  packId?: QFace['AniStickerPackId']
  stickerId?: QFace['AniStickerId']
  sourceType?: 1
  stickerType?: QFace['AniStickerType']
  resultId?: '' | '1' | '2' | '3' | '4' | '5' | '6'
  randomType?: 1
  imageType?: unknown
  pokeType?: number // 0 非 poke，1 PC 戳一戳，依此类推
  spokeSummary?: unknown
  doubleHit?: unknown
  vaspokeId?: unknown
  vaspokeName?: unknown
  vaspokeMinver?: unknown
  pokeStrength?: unknown
  msgType?: unknown
  faceBubbleCount?: unknown
  pokeFlag?: unknown
  oldVersionStr?: unknown

  /**
   * 相同表情接龙的个数，2024「龙年快乐」表情首次使用。
   */
  chainCount?: 1

  /**
   * 用于接收
   */
  surpriseId?: ''

  /**
   * 用于发送，此处为腾讯 typo
   */
  superisedId?: ''
}

export enum FaceType {
  /**
   * 小黄脸表情
   */
  Normal1 = 1,

  /**
   * 新小黄脸表情，QSid = IQLid = AQLid
   */
  Normal2 = 2,

  /**
   * 超级表情
   */
  Super = 3,

  /**
   * PC 戳一戳（窗口抖动）
   */
  PCPoke = 5,
}

export interface QFace {
  QSid: string
  QDes: string
  IQLid: string
  AQLid: string
  EMCode: string
  isStatic?: '1'
  isCMEmoji?: '1'
  AniStickerType?: 1 | 3
  AniStickerPackId?: '1'
  AniStickerId?: string // '1'
  QHide?: '1'
  Input: string[]
}

export interface FileElement {
  fileMd5: string
  fileName: string
  filePath: string
  fileSize: string
  picHeight: number
  picWidth: number
  picThumbPath: Record<string, unknown>
  expireTime: string
  file10MMd5: string
  fileSha: string
  fileSha3: string
  videoDuration: number
  transferStatus: number
  progress: number
  invalidState: number
  fileUuid: string
  fileSubId: string
  thumbFileSize: number
  fileBizId: unknown
  thumbMd5: unknown
  folderId: unknown
  fileGroupIndex: number
  fileTransType: unknown
}

export interface GrayTipElement {
  subElementType?: unknown
  revokeElement?: unknown
  proclamationElement?: unknown
  emojiReplyElement?: unknown
  groupElement?: GroupElement
  buddyElement?: unknown
  feedMsgElement?: unknown
  essenceElement?: unknown
  groupNotifyElement?: unknown
  buddyNotifyElement?: unknown
  xmlElement?: XmlElement
  fileReceiptElement?: unknown
  localGrayTipElement?: unknown
  blockGrayTipElement?: unknown
  aioOpGrayTipElement?: unknown
  jsonGrayTipElement?: JsonGrayTipElement
}

export interface JsonGrayTipElement {
  busiId: string
  jsonStr: string
  isServer: boolean
}

export interface PttElement {
  fileName: string
  filePath: string
  md5HexStr: string
  fileSize: string
  duration: number
  formatType: number
  voiceType: number
  voiceChangeType: number
  canConvert2Text: boolean
  fileId: number
  fileUuid: string
  text: string
  translateStatus: number
  transferStatus: number
  progress: number
  playState: number
  waveAmplitudes: number[]
  invalidState: number
  fileSubId: string
  fileBizId: unknown
}

export interface ReplyElement {
  replayMsgId: string
  replayMsgSeq: string
  replayMsgRootSeq: string
  replayMsgRootMsgId: string
  replayMsgRootCommentCnt: string
  sourceMsgIdInRecords: string
  sourceMsgText: string
  sourceMsgTextElems: {
    replyAbsElemType: number
    textElemContent: string
    faceElem: unknown
  }[]
  senderUid: string
  senderUidStr: string
  replyMsgClientSeq: string
  replyMsgTime: string
  replyMsgRevokeType: number
  sourceMsgIsIncPic: boolean
  sourceMsgExpired: boolean
  anonymousNickName: unknown
  originalMsgState: unknown
  senderUin: string
  senderUinStr: string
}

export interface VideoElement {
  filePath: string
  fileName: string
  videoMd5: string
  thumbMd5: string
  fileTime: number
  thumbSize: number
  fileFormat: number
  fileSize: string
  thumbWidth: number
  thumbHeight: number
  busiType: number
  subBusiType: number
  thumbPath: Record<string, unknown>
  transferStatus: number
  progress: number
  invalidState: number
  fileUuid: string
  fileSubId: string
  fileBizId: unknown
}

export interface GroupElement {
  type: number
  role: number
  groupName?: string
  memberUid?: string
  memberNick?: string
  memberRemark?: string
  adminUid?: string
  adminNick?: string
  adminRemark?: string
  createGroup?: unknown
  memberAdd?: {
    showType: number
    otherAdd?: OtherAdd
    otherAddByOtherQRCode?: unknown
    otherAddByYourQRCode?: unknown
    youAddByOtherQRCode?: unknown
    otherInviteOther?: unknown
    otherInviteYou?: unknown
    youInviteOther?: unknown
  }
  shutUp?: {
    curTime: string
    duration: string
    admin: {
      uid: string
      card: string
      name: string
      role: number
      uin: string
    }
    member: {
      uid: string
      card: string
      name: string
      role: number
      uin: string
    }
  }
  memberUin?: string
  adminUin?: string
}

export interface OtherAdd {
  uid?: string
  name?: string
  uin?: string
}

export interface XmlElement {
  busiType?: string
  busiId?: string
  c2cType: number
  serviceType: number
  ctrlFlag: number
  content?: string
  templId?: string
  seqId?: string
  templParam?: unknown
  pbReserv?: string
  members?: unknown
}

export interface EmojiAd {
  url: string
  desc: string
}

export interface EmojiMall {
  packageId: number
  emojiId: number
}

export interface EmojiZplan {
  actionId: number
  actionName: string
  actionType: number
  playerNumber: number
  peerUid: string
  bytesReserveInfo: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ThumbPath {}

export interface TextElement {
  content: string
  atType: AtType

  /**
   * Uin
   */
  atUid: string

  atTinyId: string

  /**
   * Uid
   */
  atNtUid: string
  // atNtUin: string

  subElementType: number
  atChannelId: string
  atRoleId: string
  atRoleColor: number
  atRoleName: string
  needNotify: number
}

export enum AtType {
  None = 0,
  All = 1,
  Normal = 2,
}

export interface RoleInfo {
  roleId: string
  name: string
  color: number
}

export interface Media {
  msgId: string
  chatType: ChatType
  peerUid: string
  elementId: string
  thumbSize: number
  downloadType: number
}

export interface ArkElement {
  bytesData: string
  linkInfo: never
  subElementType: never
}

export type ArkElementData =
  | ArkQQMusicShare
  | ArkNeteaseMusicShare
  | ArkContact
  | ArkForum

export interface ArkMusicShareBase {
  app: 'com.tencent.structmsg'
  config: {
    ctime: number // 1700000000
    forward: 0 | 1
    token: string
    type: 'normal'
  }
}

export interface ArkQQMusicShare extends ArkMusicShareBase {}

export interface ArkNeteaseMusicShare extends ArkMusicShareBase {}

export interface ArkContact {}

export interface ArkForum {}

export interface Contact {
  id: string
  contactId: string // '7000000000000000000'
  sortField: string // '1700000000'
  chatType: ChatType
  senderUid: string
  senderUin: string
  peerUid: string
  peerUin: string
  msgSeq: string
  c2cClientMsgSeq: string // '0'
  msgUid: string
  msgRandom: string // '1770000000'
  msgTime: string // '1700000000'
  sendRemarkName: ''
  sendMemberName: ''
  sendNickName: string
  peerName: string
  remark: ''
  memberName: unknown
  avatarUrl: ''
  avatarPath: string
  abstractContent: AbstractContent[]
  sendStatus: number // 2
  topFlag: number // 0
  topFlagTime: string // '0'
  draftFlag: number // 0
  draftTime: string // '0'
  specialCareFlag: number // 0
  sessionType: number // 2
  shieldFlag: string // '1'
  atType: number // 0
  draft: unknown[]
  hiddenFlag: number // 0
  keepHiddenFlag: number // 2
  isMsgDisturb: boolean
  nestedSortedContactList: unknown[]
  nestedChangedList: unknown[]
  unreadCnt: string // '1'
  unreadChatCnt: number
  unreadFlag: string // '2'
  isBeat: boolean
  isOnlineMsg: boolean
  msgId: string
  notifiedType: number
  isBlock: boolean
  listOfSpecificEventTypeInfosInMsgBox: SpecificEventTypeInfo[]
  guildContactInfo: unknown
  vasPersonalInfo: VasPersonalInfo
  vasMsgInfo: VasMsgInfo
  anonymousFlag: number
  extBuffer: unknown
  extAttrs: unknown[]
  liteBusiness: unknown
}

export interface AbstractContent {
  elementType: number
  elementSubType: number
  content: string // like summary
  custom_content: string // ''
  index: number
  isSetProclamation: unknown
  isSetEssence: unknown
  operatorRole: unknown
  operatorTinyId: unknown
  fileName: unknown
  tinyId: unknown
  msgSeq: unknown
  msgId: unknown
  emojiId: unknown
  emojiType: unknown
  localGrayTipType: unknown
  grayTiPElement: unknown
  textGiftElement: unknown
  calendarElement: unknown
  channelStateElement: unknown
  onlineFileMsgCnt: number
}

export interface VasPersonalInfo {
  personalNamePlateInfo: VasPersonalNamePlateInfo
  colorNickId: unknown
  loveChatId: unknown
  loverUin: unknown
  vipPendantId: unknown
  fontId: unknown
  vaDataChangeRand: unknown
}

export interface VasPersonalNamePlateInfo {
  isGray: unknown
  vipType: unknown
  vipLevel: unknown
  namePlateId: unknown
  carouselNamePlateIds: unknown[]
  diyNamePlateItemId: unknown
  diyNamePlateContentIds: unknown[]
  extendNamePlateId: unknown
  gameNamePlateId: unknown
  vipStarFlag: unknown
}

export interface VasMsgInfo {
  bubbleId: 0
}

export interface SpecificEventTypeInfo {
  eventTypeInMsgBox: number // 2001
  msgInfos: [
    {
      msgSeq: string
      msgTime: string // '1700000000'
      highlightDigest: ''
    },
  ]
}

export interface ContactList {
  listType: ContactListType
  sortedContactList: string[]
  changedList: Contact[]
  notificationType: 1
  unreadCnt: string // '99999'
  unreadFlag: string // '1'
  cacheLocation: string // '1'
  firstContactPos: string // '1'
  atTheTop: true
  atTheBottom: true
}

export enum ContactListType {
  Normal = 1,
  MsgBox = 2,
}
