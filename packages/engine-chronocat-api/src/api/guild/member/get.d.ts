import type { GuildMember } from '@chronocat/shell';
export declare const buildGuildMemberGet: (_ctx: ChronocatContext) => ({ user_id }: GuildMemberGetPayload) => Promise<GuildMember>;
