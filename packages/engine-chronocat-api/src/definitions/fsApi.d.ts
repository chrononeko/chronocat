/// <reference types="node" />
import type { PathLike } from 'node:fs';
export declare const getFileMd5: import("../types").NtApi<string, [PathLike]>;
export declare const getImageSizeFromPath: import("../types").NtApi<{
    width: number;
    height: number;
    type: string;
    mime: string;
    wUnits: string;
    hUnits: string;
}, [PathLike]>;
export declare const getFileSize: import("../types").NtApi<number, [PathLike]>;
export declare const getFileType: import("../types").NtApi<{
    mime: string;
}, [PathLike]>;
