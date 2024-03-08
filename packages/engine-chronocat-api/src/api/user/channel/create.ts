import type { Channel, ChronocatContext, UserPayload } from '@chronocat/shell'

export const buildUserChannelCreate =
  (_ctx: ChronocatContext) =>
  async ({ user_id }: UserPayload): Promise<Channel> => {
    return {
      id: `private:${user_id}`,
      type: 1, // ChannelType.DIRECT
      avatar: undefined as unknown as string,
    }
  }
