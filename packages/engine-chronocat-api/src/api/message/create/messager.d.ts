import type { Peer, Element as RedElement } from '@chronocat/red';
import type { ChronocatContext, ChronocatSatoriServerConfig, Message } from '@chronocat/shell';
import type h from '@satorijs/element';
import type { O } from 'ts-toolbelt';
import type { Common } from '../../../common';
declare class State {
    type: 'message';
    constructor(type: 'message');
}
export declare class Messager {
    ctx: ChronocatContext;
    config: ChronocatSatoriServerConfig;
    common: Common;
    channelId: string;
    constructor(ctx: ChronocatContext, config: ChronocatSatoriServerConfig, common: Common, channelId: string);
    peer: Partial<Peer>;
    errors: Error[];
    results: Message[];
    stack: State[];
    children: O.Partial<RedElement, 'deep'>[];
    prepare: () => Promise<void>;
    render: (elements: h[], flush?: boolean) => Promise<void>;
    send(content: h[]): Promise<Message[]>;
    flush: () => Promise<void>;
    visit: (element: h) => Promise<void>;
}
export {};
