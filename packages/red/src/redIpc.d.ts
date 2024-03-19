export type RedIpcArgs = [RedIpcEvent, RedIpcData];
export interface RedIpcEvent {
    type: 'request' | 'response';
    eventName: string;
    callbackId?: string;
    promiseStatue?: 'full';
}
export type RedIpcData = RedIpcDataRequest | RedIpcDataEvent | RedIpcDataResponse;
export type RedIpcDataRequest = [method: string, ...args: unknown[]];
export interface RedIpcDataEvent {
    cmdName: string;
    cmdType: 'event';
    payload: unknown;
}
export type RedIpcDataResponse = unknown;
