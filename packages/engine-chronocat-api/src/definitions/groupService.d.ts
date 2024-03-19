export type SceneId = unknown;
export declare const getMemberInfo: import("../types").NtApi<unknown, [{
    forceUpdate: boolean;
    groupCode: number;
    uids: string[];
}]>;
export declare const getGroupDetailInfo: import("../types").NtApi<Result, [{
    groupCode: string;
    source: 4;
}]>;
export declare const createMemberListScene: import("../types").NtApi<unknown, [{
    groupCode: number;
    scene: 'groupMemberList_MainWindow';
}]>;
export declare const searchMember: import("../types").NtApi<undefined, [{
    sceneId: SceneId;
    keyword: string;
}]>;
export declare const destroyMemberListScene: import("../types").NtApi<undefined, [{
    sceneId: SceneId;
}]>;
export interface MemberListResult {
    result: {
        ids: {
            uid: string;
            index: string;
        }[];
        infos: {
            get: (uid: string) => {
                uid: string;
                qid: '';
                uin: string;
                nick: string;
                remark: string;
                cardType: 0;
                cardName: string;
                role: number;
                avatarPath: string;
                shutUpTime: number;
                isDelete: boolean;
                isSpecialConcerned: boolean;
            } | undefined;
        };
    };
}
export declare const getNextMemberList: import("../types").NtApi<MemberListResult, [{
    sceneId: SceneId;
    lastId: undefined;
    num: number;
}]>;
export declare const setMemberShutUp: import("../types").NtApi<unknown, [{
    groupCode: string;
    memList: {
        uin?: string;
        uid?: string;
        timeStamp: number;
    }[];
}]>;
export declare const setGroupShutUp: import("../types").NtApi<unknown, [{
    groupCode: string;
    shutUp: boolean;
}]>;
export declare const kickMember: import("../types").NtApi<unknown, [{
    groupCode: string;
    kickUids: string[];
    refuseForever: boolean;
    kickReason: string;
}]>;
export declare const quitGroup: import("../types").NtApi<{
    result: number;
    errMsg: string;
}, [{
    groupCode: string;
}]>;
export declare const operateSysNotify: import("../types").NtApi<unknown, [{
    doubt: false;
    operateMsg: {
        operateType: 1;
        targetMsg: {
            seq: '';
            type: 1;
            groupCode: string;
            postscript: '';
        };
    };
}]>;
