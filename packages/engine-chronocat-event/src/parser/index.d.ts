import type { ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig } from '@chronocat/shell';
import type { O } from 'ts-toolbelt';
export declare const buildParser: (ctx: ChronocatContext, config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>) => (message: RedMessage) => Promise<Event[]>;
export declare const parseMessageRecv: (ctx: ChronocatContext, config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>, message: RedMessage) => Promise<Event[]>;
export declare const parseMessage: (ctx: ChronocatContext, config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>, message: RedMessage) => Promise<any[]>;
