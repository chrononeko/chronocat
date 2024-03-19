import type { Engine } from './types';
export * from './satori/types';
export * from './services/config/configEntity';
export * from './types';
export declare const chronocat: () => {
    load: (x: Engine) => void;
};
