import type { Contact, ContactList, Group, Member, Profile, RedMessage } from './redEntity';
export interface Result {
    result: number;
    errMsg: string;
}
export interface OnRecvMsg {
    msgList: RedMessage[];
}
export interface OnProfileChanged {
    profiles: [
        string,
        {
            uin: string;
        }
    ][] & {
        get: (uid: string) => Profile;
    };
    infos: [
        string,
        {
            uin: string;
        }
    ][];
}
export interface OnMemberInfoChange {
    groupCode: string;
    dataSource: number;
    members: [
        string,
        {
            uin: string;
            role: number;
        }
    ][] & {
        get: (uid: string) => Member;
    };
}
export interface OnMemberListChange {
    info: {
        sceneId: string;
        ids: unknown[];
        infos: [
            string,
            {
                uin: string;
                role: number;
            }
        ][] & {
            get: (uid: string) => Member;
        };
    };
}
export interface OnRichMediaDownloadComplete {
    notifyInfo: {
        /**
         * 下载富媒体的类型。1 为原图，2 为缩略图。
         */
        fileDownType: 1 | 2;
        msgId: string;
        msgElementId: string;
        filePath: string;
    };
}
export interface OnGroupListUpdate {
    updateType: 1;
    groupList: Group[];
}
export interface OnBuddyListChange {
    /**
     * 好友分组列表。
     */
    data: {
        /**
         * 好友分组 ID。
         */
        categoryId: number;
        /**
         * 好友分组名称。
         */
        categoryName: string;
        /**
         * 分组内好友个数。
         */
        categroyMbCount: number;
        /**
         * 分组内好友列表。
         */
        buddyList: Profile[];
    }[];
}
export interface OnAddSendMsg {
    msgRecord: RedMessage;
}
export interface OnMsgInfoListUpdate {
    msgList: RedMessage[];
}
export interface BuddyReq {
    isDecide: boolean;
    isInitiator: boolean;
    friendUid: string;
    reqType: number;
    reqSubType: number;
    reqTime: string;
    extWords: string;
    flag: number;
    preGroupingId: number;
    commFriendNum: number;
    curFriendMax: number;
    isShowCard: boolean;
    isUnread: boolean;
    isDoubt: boolean;
    nameMore: '';
    friendNick: string;
    friendAvatarUrl: '';
    sourceId: number;
    groupCode: string;
    isBuddy: unknown;
    isAgreed: boolean;
    relation: number;
}
export interface OnBuddyReqChange {
    unreadNums: number;
    buddyReqs: BuddyReq[];
}
export interface OnRecentContactListChangedVer2 {
    changedRecentContactLists: ContactList[];
    seq: number;
}
export interface MsgsIncludeSelf {
    result: 0;
    errMsg: '';
    msgList: RedMessage[];
}
export interface OnOpenParamChange {
    data: Contact[];
}
