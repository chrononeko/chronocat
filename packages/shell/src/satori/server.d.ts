import type { ChronocatSatoriServerConfig } from '../services/config/configEntity';
import type { ChronocatContext, SatoriDispatchMessage } from '../types';
export declare const initSatoriServer: (cctx: ChronocatContext, config: ChronocatSatoriServerConfig) => Promise<{
    dispatcher: (message: SatoriDispatchMessage) => Promise<void>;
}>;
