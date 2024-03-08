import type { ChronocatContext, Guild, GuildGetPayload } from '@chronocat/shell'

export const buildGuildGet =
  (_ctx: ChronocatContext) =>
  async ({ guild_id }: GuildGetPayload): Promise<Guild> => {
    return {
      id: guild_id,
      name: undefined as unknown as string,
      avatar: `https://p.qlogo.cn/gh/${guild_id}/${guild_id}/640`,
    }
  }
