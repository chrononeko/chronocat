/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ChronocatContext, Guild, GuildGetPayload } from '@chronocat/shell'
import { groupMap } from '../../globalVars'

export const buildGuildGet =
  (_ctx: ChronocatContext) =>
  async ({ guild_id }: GuildGetPayload): Promise<Guild> => {
    const result: Guild = {
      id: guild_id,
      name: undefined as unknown as string,
      avatar: `https://p.qlogo.cn/gh/${guild_id}/${guild_id}/640`,
    }

    const group = groupMap[guild_id]

    if (group) {
      result.name = group.groupName
    }

    return result
  }
