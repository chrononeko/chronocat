/// <reference types="node" />
import { EventEmitter } from 'node:events';
type EmittedEvents = Record<string | symbol, (...args: unknown[]) => unknown>;
export interface TypedEventEmitter<ES extends EmittedEvents> {
    on<E extends keyof ES>(event: E, listener: ES[E]): this;
    once<E extends keyof ES>(event: E, listener: ES[E]): this;
    emit<E extends keyof ES>(event: E, ...args: Parameters<ES[E]>): boolean;
}
export declare class TypedEventEmitter<ES extends EmittedEvents> extends EventEmitter {
}
export type ChronoEvents = {
    buddyListChange: () => void;
    groupListUpdate: () => void;
};
export declare class ChronoEventEmitter extends TypedEventEmitter<ChronoEvents> {
    emitBuddyListChange: () => boolean;
    emitGroupListUpdate: () => boolean;
}
export {};
