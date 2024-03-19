import type { BuddyReq, RedMessage } from '@chronocat/red';
import type { ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig, SatoriDispatchMessage } from '@chronocat/shell';
import type { O } from 'ts-toolbelt';
export declare class MessageCreatedDispatchMessage implements SatoriDispatchMessage {
    private messages;
    constructor(messages: RedMessage[]);
    type: "satori";
    toSatori: (ctx: ChronocatContext, config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>) => Promise<Event[]>;
}
export declare class MessageDeletedDispatchMessage implements SatoriDispatchMessage {
    private messages;
    constructor(messages: RedMessage[]);
    type: "satori";
    toSatori: (ctx: ChronocatContext, config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>) => Promise<Event[]>;
}
export declare class FriendRequestDispatchMessage implements SatoriDispatchMessage {
    private buddyReq;
    private uin;
    constructor(buddyReq: BuddyReq, uin: string);
    type: "satori";
    toSatori: (ctx: ChronocatContext, _config: O.Intersect<ChronocatLogCurrentConfig, ChronocatSatoriEventsConfig>) => Promise<Event[]>;
}
