import type { ChronocatSatoriWebHookConfig } from '../services/config/configEntity';
import type { ChronocatContext, SatoriDispatchMessage } from '../types';
export declare const initSatoriWebHook: (cctx: ChronocatContext, config: ChronocatSatoriWebHookConfig) => Promise<{
    dispatcher: (message: SatoriDispatchMessage) => void;
}>;
