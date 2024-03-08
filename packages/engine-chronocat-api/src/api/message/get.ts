import type {
  ChronocatContext,
  Message,
  MessageGetPayload,
} from '@chronocat/shell'

export const buildMessageGet =
  (_ctx: ChronocatContext) =>
  async ({ message_id }: MessageGetPayload): Promise<Message> => {
    return {
      id: message_id,
      content: undefined as unknown as string,
    }
  }
