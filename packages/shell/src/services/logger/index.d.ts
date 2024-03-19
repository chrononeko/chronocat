import type { Event } from '../../satori/types';
interface LogOptions {
    code?: number;
    /**
     * 打印错误日志后仍然抛出异常。仅用于阻断后续逻辑执行。
     */
    throw?: boolean;
}
declare class ChronocatLogger {
    private file;
    private online;
    private uin;
    private isDebug;
    private logiri;
    private task;
    private init;
    constructor();
    private getPrefix;
    private writeConsole;
    private writeFile;
    private applyZeroWidthLogTag;
    write: (output: string) => void;
    parse: (data: Event) => void;
    private message;
    info: (m: string | Error, options?: LogOptions) => void;
    warn: (m: string | Error, options?: LogOptions) => void;
    error: (m: string | Error, options?: LogOptions) => void;
    debug: (m: string | Error, options?: LogOptions) => void;
}
export declare const l: ChronocatLogger;
export {};
