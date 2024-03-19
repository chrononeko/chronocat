export interface MsgBoxActiv {
    activate: (peerUid: string) => void;
}
export declare const msgBoxActiv: (ctx: ChronocatContext) => MsgBoxActiv;
