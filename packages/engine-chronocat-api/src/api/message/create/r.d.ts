import type { CommonSaveResult } from '../../../common/types';
export declare const r: (<T extends "payload/sendMsg" | "peer/private" | "peer/group", D>(type: T, data: D) => {
    readonly 'payload/sendMsg': {
        readonly msgId: "0";
        readonly elements: readonly [];
    };
    readonly 'peer/private': {
        readonly chatType: 1;
        readonly guildId: "";
        readonly peerUid: "";
        readonly peerUin: "";
    };
    readonly 'peer/group': {
        readonly chatType: 2;
        readonly guildId: "";
        readonly peerUid: "";
        readonly peerUin: "";
    };
}[T] & D) & {
    reg: {
        readonly 'payload/sendMsg': {
            readonly msgId: "0";
            readonly elements: readonly [];
        };
        readonly 'peer/private': {
            readonly chatType: 1;
            readonly guildId: "";
            readonly peerUid: "";
            readonly peerUin: "";
        };
        readonly 'peer/group': {
            readonly chatType: 2;
            readonly guildId: "";
            readonly peerUid: "";
            readonly peerUin: "";
        };
    };
    peerPrivate: (peerUin: string) => Peer;
    peerGroup: (peerUin: string) => Peer;
    text: (content: string) => Element;
    at: (ctx: ChronocatContext, name: string, id: string) => Element;
    face: (qface: QFace, faceType: FaceType) => Element;
    pcPoke: (pokeType: number) => Element;
    reply: (replayMsgId?: string, replayMsgSeq?: string, senderUin?: string) => Element;
    remoteImage: (saveResult: CommonSaveResult, picType: number) => Element;
    remoteAudio: (saveResult: CommonSaveResult, duration: number, waveAmplitudes?: number[]) => Element;
    remoteFile: (saveResult: CommonSaveResult) => Element;
};
