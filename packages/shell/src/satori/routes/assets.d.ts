import type { RouteContext } from './types';
export declare const assets: ({ cctx, raw, res, }: RouteContext & {
    raw: string;
}) => Promise<void>;
