import type { ChronocatContext, GuildMemberKickPayload } from '@chronocat/shell'
import { kickMember } from '../../../definitions/groupService'

export const buildGuildMemberKick =
  (ctx: ChronocatContext) =>
  async ({ guild_id, user_id, permanent }: GuildMemberKickPayload) => {
    await kickMember({
      groupCode: guild_id,
      kickUids: [ctx.chronocat.uix.getUid(user_id)!],
      refuseForever: permanent as boolean,
      kickReason: '',
    })

    return {}
  }
