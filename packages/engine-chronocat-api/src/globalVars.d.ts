import type { Group, Profile, RedIpcData, RedMessage } from '@chronocat/red';
import { ChronoEventEmitter } from './emitter';
export declare const requestMethodMap: Record<string, string>;
export declare const requestCallbackMap: Record<string, (/* this: RedIpcEvent, */ detail: RedIpcData) => void>;
export declare const groupMap: Record<string, Group>;
export declare const roleMap: Record<string, Record<string, number>>;
export declare const friendMap: Record<string, Profile>;
export declare const richMediaDownloadMap: Record<string, (path: string) => void>;
export declare const sendQueue: ((msg: RedMessage) => void)[];
export declare const sendCallbackMap: Record<string, (msg: RedMessage) => void>;
export declare const chronoEventEmitter: ChronoEventEmitter;
