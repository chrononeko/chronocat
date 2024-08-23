import type { ChronocatContext, GuildMemberKickPayload } from '@chronocat/shell'
import { kickMember } from '../../../definitions/groupService'

export const buildGuildMemberKick =
  (ctx: ChronocatContext) =>
  async ({ guild_id, user_id, permanent }: GuildMemberKickPayload) => {
    const uid = await ctx.chronocat.uix.getUid2(user_id, guild_id)
    if (!uid) {
      ctx.chronocat.l.error('内部错误', {
        code: 2152,
        throw: true,
      })
      return {}
    }

    await kickMember({
      groupCode: guild_id,
      kickUids: [uid],
      refuseForever: permanent as boolean,
      kickReason: '',
    })

    return {}
  }
