export declare const common: {
    readonly send: (ctx: ChronocatContext, peer: Peer, elements: Element[]) => Promise<RedMessage>;
    readonly sendForward: (ctx: ChronocatContext, peer: Peer, infos: {
        msgId: string;
        senderShowName: string;
    }[], source?: any) => Promise<unknown>;
    readonly save: (ctx: ChronocatContext, urlString: string, fileInfo?: {
        fileName?: string;
        fileMime?: string;
    }) => Promise<import("./types").CommonSaveResult>;
};
export type Common = typeof common;
