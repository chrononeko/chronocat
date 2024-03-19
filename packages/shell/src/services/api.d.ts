import type { Methods } from '../types';
export type ApiImpl<M extends keyof Methods> = ((...args: Methods[M][0]) => Promise<Methods[M][1]>) & {
    notimpl: boolean;
    engine: string;
    priority: number;
};
export type Api = {
    [M in keyof Methods]: ApiImpl<M>;
} & {
    register: (engine: string, priority?: number) => <M extends keyof Methods>(method: M, impl: (...args: Methods[M][0]) => Promise<Methods[M][1]>) => void;
};
export declare const api: Api;
