import type { Element, Peer, RedMessage } from '@chronocat/red';
import type { IpcManData } from 'ipcman';
export declare const buildHandler: (ctx: ChronocatContext) => (data: IpcManData) => void;
export declare const filterMessage: (message: {
    peer: Peer;
    elements: Element[];
} | RedMessage) => boolean;
