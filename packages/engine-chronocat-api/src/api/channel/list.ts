import type {
  ChannelListPayload,
  ChannelListResponse,
  ChronocatContext,
} from '@chronocat/shell'

export const buildChannelList =
  (_ctx: ChronocatContext) =>
  async ({ guild_id }: ChannelListPayload): Promise<ChannelListResponse> => {
    return {
      data: [
        {
          id: guild_id,
          avatar: `https://p.qlogo.cn/gh/${guild_id}/${guild_id}/640`,
          type: 0, // ChannelType.TEXT
        },
      ],
    }
  }
