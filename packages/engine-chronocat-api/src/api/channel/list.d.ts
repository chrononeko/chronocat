import type { ChannelListResponse } from '@chronocat/shell';
export declare const buildChannelList: (_ctx: ChronocatContext) => ({ guild_id }: ChannelListPayload) => Promise<ChannelListResponse>;
