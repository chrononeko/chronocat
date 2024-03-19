import type { Message } from '@chronocat/shell';
export declare const buildMessageGet: (_ctx: ChronocatContext) => ({ message_id }: MessageGetPayload) => Promise<Message>;
