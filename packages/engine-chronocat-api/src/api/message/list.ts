import type {
  ChronocatContext,
  MessageListPayload,
  MessageListResponse,
} from '@chronocat/shell'

export const buildMessageList =
  (_ctx: ChronocatContext) =>
  async (_: MessageListPayload): Promise<MessageListResponse> => {
    return {
      data: [],
    }
  }
