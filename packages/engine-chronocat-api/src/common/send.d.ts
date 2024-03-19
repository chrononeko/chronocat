/// <reference types="node" />
import type { Element, Peer } from '@chronocat/red';
import type { O } from 'ts-toolbelt';
export declare const commonSend: (ctx: ChronocatContext, peer: Peer, elements: O.Partial<Element, 'deep'>[]) => Promise<RedMessage>;
export declare let sendForwardMsgBuffer: Buffer;
export declare let sendForwardCover: string;
export declare const commonSendForward: (ctx: ChronocatContext, peer: Peer, infos: {
    msgId: string;
    senderShowName: string;
}[], source?: Partial<Peer> | undefined) => Promise<unknown>;
