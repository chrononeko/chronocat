import type {
  Channel,
  ChannelGetPayload,
  ChronocatContext,
} from '@chronocat/shell'

export const buildChannelGet =
  (_ctx: ChronocatContext) =>
  async ({ channel_id }: ChannelGetPayload): Promise<Channel> => {
    return {
      id: channel_id,
      type: 0, // ChannelType.TEXT
      avatar: `https://p.qlogo.cn/gh/${channel_id}/${channel_id}/640`,
    }
  }
