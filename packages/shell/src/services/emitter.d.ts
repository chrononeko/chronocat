import type { DispatchMessage } from '../types';
export type Emit = (message: DispatchMessage) => unknown;
export declare const emitter: {
    register: (e: Emit) => number;
    emit: (message: DispatchMessage) => void;
};
