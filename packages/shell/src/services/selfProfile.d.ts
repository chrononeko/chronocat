import type { DispatchMessage } from '../types';
export declare const setSelfProfile: (message: DispatchMessage) => Promise<void>;
export declare const getSelfProfile: () => {
    nick: string;
};
