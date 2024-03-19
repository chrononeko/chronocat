import type { NtApi } from './types';
export declare const invoke: (channel: string, eventName: unknown, ...args: unknown[]) => Promise<unknown>;
export type Invoke = typeof invoke;
export declare function define<R = undefined, A extends unknown[] = []>(eventName: string, method: string): NtApi<R, A>;
