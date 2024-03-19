import type { Element, RedMessage } from '@chronocat/red';
import type { O } from 'ts-toolbelt';
export declare const recallMsg: import("../types").NtApi<unknown, [{
    peer: Peer;
    msgIds: string[];
}]>;
export declare const downloadRichMedia: import("../types").NtApi<unknown, [{
    getReq: {
        msgId: string;
        chatType: number;
        peerUid: string;
        elementId: string;
        thumbSize: number;
        downloadType: number;
    };
}]>;
export declare const getMsgsIncludeSelf: import("../types").NtApi<object, [{
    peer: Peer;
    msgId: string;
    cnt: number;
    queryOrder: boolean;
}]>;
export declare const getRichMediaFilePath: import("../types").NtApi<string, [{
    md5HexStr: string;
    fileName: string;
    elementType: number;
    elementSubType: number;
    thumbSize: number;
    needCreate: boolean;
    fileType: number;
}]>;
export declare const getRichMediaFilePathForGuild: import("../types").NtApi<string, [{
    path_info: {
        md5HexStr: string;
        fileName: string;
        elementType: number;
        elementSubType: number;
        thumbSize: number;
        needCreate: boolean;
        fileType: number;
        downloadType: number;
        file_uuid: string;
    };
}]>;
export declare const sendMsg: import("../types").NtApi<unknown, [{
    msgId: '0';
    peer: Peer;
    msgElements: O.Partial<Element, 'deep'>[];
}]>;
export declare const multiForwardMsgWithComment: import("../types").NtApi<unknown, [{
    msgInfos: {
        msgId: string;
        senderShowName: string;
    }[];
    srcContact: Peer;
    dstContact: Peer;
    commentElements: [];
}]>;
export declare const getEmojiResourcePath: import("../types").NtApi<{
    result: 0;
    errMsg: 'success';
    resourcePath: string;
}, [{
    type: 0 | 1 | 2 | 3 | 4;
}]>;
export declare const getAioFirstViewLatestMsgsAndAddActiveChat: import("../types").NtApi<{
    result: 0;
    errMsg: 'success';
    msgList: RedMessage[];
    needContinueGetMsg: boolean;
}, [{
    peer: Peer;
    cnt: number;
}]>;
export declare const getMsgsIncludeSelfAndAddActiveChat: import("../types").NtApi<{
    result: 0;
    errMsg: 'success';
    msgList: RedMessage[];
}, [{
    peer: Peer;
    msgId: string;
    cnt: number;
    queryOrder: boolean;
}]>;
