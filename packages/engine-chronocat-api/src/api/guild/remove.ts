import type { ChronocatContext, GuildRemovePayload } from '@chronocat/shell'
import { quitGroup } from '../../definitions/groupService'

export const buildGuildRemove =
  (_ctx: ChronocatContext) =>
  async ({ guild_id }: GuildRemovePayload) => {
    await quitGroup({
      groupCode: guild_id,
    })

    return {}
  }
