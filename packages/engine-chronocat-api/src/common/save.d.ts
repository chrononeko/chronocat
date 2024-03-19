import type { CommonSaveResult } from './types';
export declare const commonSave: (ctx: ChronocatContext, urlString: string, fileInfo?: {
    fileName?: string | undefined;
    fileMime?: string | undefined;
}) => Promise<CommonSaveResult>;
