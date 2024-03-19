import type { ChronocatContext, DispatchMessage } from './types';
export declare const initServers: (ctx: ChronocatContext) => Promise<{
    emit: (message: DispatchMessage) => void;
}>;
